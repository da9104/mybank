import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner"

export interface Account {
    id: string;
    user_id: string;
    account_number: string;
    balance: number;
    currency: string;
    account_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: string;
    account_id: string;
    description: string;
    amount: number;
    type: string;
    created_at: string;
    updated_at: string;
}

interface AccountState {
    account: Account | null;
    accounts: Account[] | null;
    loading: boolean;
    setAccountActive: (index: number) => void;
    setActiveAccountById: (accountId: string) => void;
    fetchUserAccount: (userId?: string) => Promise<void>;
    fetchAllAccounts: () => Promise<void>;

    createAccount: () => Promise<void>;
    deleteAccount: (userId?: string) => Promise<boolean>;
    addMoney: (amount?: number, description?: string) => Promise<boolean>;
    withdrawMoney: (amount?: number, description?: string) => Promise<boolean>;
}

const useAccountStore = create<AccountState>()(
    immer((set, get) => ({
        account: null,
        accounts: [],
        loading: true,

        setAccountActive: (index) => set((state) => {
            if (state.accounts && state.accounts[index]) {
                state.account = state.accounts[index];
            }
        }),

        setActiveAccountById: (accountId) => set((state) => {
            if (state.accounts) {
                const found = state.accounts.find((a) => a.id === accountId);
                if (found) state.account = found;
            }
        }),

        fetchAllAccounts: async (userId?: string) => {
            try {
                set({ loading: true });
                let query = supabase.from('accounts').select('*')
                if (userId) query.eq('user_id', userId);

                const { data, error } = await query;

                if (error) {
                    throw new Error(error.message);
                }

                set((state) => {
                    state.accounts = data;
                });
            } catch (error) {
                console.error('Error fetching accounts:', error);
            } finally {
                set({ loading: false });
            }
        },

        fetchUserAccount: async (userId?: string) => {
            try {
                set({ loading: true });
                let query = supabase.from('accounts').select('*')
                if (userId) query.eq('user_id', userId);

                const { data, error } = await query;

                if (error) {
                    throw new Error(error.message);
                }

                set((state) => {
                    state.accounts = data;
                    // Auto-select the first account if none selected
                    if (data && data.length > 0 && !state.account) {
                        state.account = data[0];
                    }
                });
            } catch (error) {
                toast.error("Error fetching account:")
                console.error('Error fetching account:', error);
            } finally {
                set({ loading: false });
            }
        },

        createAccount: async () => {
            try {
                set({ loading: true });
                // Use the API to create account so we get the bonus and generated account number
                const res = await fetch('/api/account/create', { method: 'POST', credentials: 'include' });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to create account');
                }

                if (data.success && data.account) {
                    set((state) => {
                        state.account = data.account;
                        if (state.accounts) {
                            state.accounts.push(data.account);
                        } else {
                            state.accounts = [data.account];
                        }
                    });
                    toast.success("Account created successfully!");
                }
            } catch (error: any) {
                console.error('Error creating account:', error);
                toast.error(error.message || "Failed to create account");
            } finally {
                set({ loading: false });
            }
        },

        deleteAccount: async (accountId?: string) => {
            if (!accountId) {
                accountId = get().account?.id;
            }

            if (!accountId) {
                throw new Error('No account selected');
            }

            try {
                set({ loading: true });

                const { error } = await supabase.from('accounts')
                    .delete()
                    .eq('id', accountId);

                if (error) {
                    throw error;
                }

                await get().fetchUserAccount();
                set((state) => { state.account = null; });
                toast.success("Account deleted successfully!");
                return true;

            } catch (error: any) {
                toast.error(error.message || "Failed to delete account");
                return false;
            } finally {
                set({ loading: false });
            }
        },

        addMoney: async (amount: number = 0, description: string = '') => {
            if (amount < 0) {
                toast.error("It must be greater than 0");
                return false;
            }
            try {
                set({ loading: true });
                const accountId = get().account?.id;

                if (!accountId) {
                    toast.error("No account selected");
                    return false;
                }

                // Use the API to create account so we get the bonus and generated account number
                const res = await fetch('/api/account/update-balance', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, accountId, description }),
                    credentials: 'include'
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to add money');
                }

                if (data.success && data.account) {
                    set((state) => {
                        if (state.account && state.account.id === data.account.id) {
                            state.account.balance = data.account.balance;
                        }
                        if (state.accounts) {
                            const index = state.accounts.findIndex(a => a.id === data.account.id);
                            if (index !== -1) {
                                state.accounts[index].balance = data.account.balance;
                            }
                        }
                    });
                    toast.success("Money added successfully!");
                    return true;
                }
                return false;
            } catch (error: any) {
                console.error('Error adding money:', error);
                toast.error(error.message || "Failed to add money");
                return false;
            } finally {
                set({ loading: false });
            }
        },

        withdrawMoney: async (amount: number = 0, description: string = '') => {
            if (amount < 0) {
                toast.error("Amount must be greater than 0");
                return false;
            }
            try {
                set({ loading: true });
                const accountId = get().account?.id;

                if (!accountId) {
                    toast.error("No account selected");
                    return false;
                }

                // Use the API to create account so we get the bonus and generated account number
                const res = await fetch('/api/account/withdraw-money', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount, accountId, description }),
                    credentials: 'include'
                });
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Failed to withdraw money');
                }

                if (data.success && data.account) {
                    set((state) => {
                        if (state.account && state.account.id === data.account.id) {
                            state.account.balance = data.account.balance;
                        }
                        if (state.accounts) {
                            const index = state.accounts.findIndex(a => a.id === data.account.id);
                            if (index !== -1) {
                                state.accounts[index].balance = data.account.balance;
                            }
                        }
                    });
                    toast.success("Money withdrawn successfully!");
                    return true;
                }
                return false;
            } catch (error: any) {
                console.error('Error withdrawing money:', error);
                toast.error(error.message || "Failed to withdraw money");
                return false;
            } finally {
                set({ loading: false });
            }
        },


    }))
)

export default useAccountStore;
