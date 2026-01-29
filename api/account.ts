import express from 'express';
import { createClient } from '../server/supabase';

const router = express.Router();

router.post('/create', async (req, res) => {
    try {
        const supabase = createClient(req, res);

        console.log('[Account API] Cookies:', req.headers.cookie);

        // Check user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Account API] Auth Error:', authError);
            const cookiesReceived = req.headers.cookie ? 'Yes (Length: ' + req.headers.cookie.length + ')' : 'No';
            return res.status(401).json({
                error: 'Unauthorized',
                details: authError,
                debug: { cookiesReceived }
            });
        }
        console.log('[Account API] User Authenticated:', user.id);

        // Generate a random account number (mock logic)
        const accountNum = 'MYBANK-' + Math.floor(100000000 + Math.random() * 900000000).toString();

        // Insert new account
        const { data, error } = await supabase
            .from('accounts')
            .insert({
                user_id: user.id,
                account_number: accountNum,
                balance: 10.00, // Sign-up bonus
                currency: 'USD',
                account_type: 'checking'
            })
            .select() // return the inserted row
            .single();

        if (error) {
            console.error('Error creating account:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ success: true, account: data });

    } catch (err: any) {
        console.error('Server error creating account:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/delete', async (req, res) => {
    try {
        const supabase = createClient(req, res);

        // Check user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Account API] Auth Error:', authError);
            const cookiesReceived = req.headers.cookie ? 'Yes (Length: ' + req.headers.cookie.length + ')' : 'No';
            return res.status(401).json({
                error: 'Unauthorized',
                details: authError,
                debug: { cookiesReceived }
            });
        }
        console.log('[Account API] User Authenticated:', user.id);

        // Delete account
        const { error } = await supabase
            .from('accounts')
            .delete()
            .eq('user_id', user.id);

        if (error) {
            console.error('Error deleting account:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(200).json({ success: true });

    } catch (err: any) {
        console.error('Server error deleting account:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/update-balance', async (req, res) => {
    try {
        const supabase = createClient(req, res);

        // Check user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Account API] Auth Error:', authError);
            const cookiesReceived = req.headers.cookie ? 'Yes (Length: ' + req.headers.cookie.length + ')' : 'No';
            return res.status(401).json({
                error: 'Unauthorized',
                details: authError,
                debug: { cookiesReceived }
            });
        }
        console.log('[Account API] User Authenticated:', user.id);

        const { accountId, amount, description } = req.body;
        console.log('[Account API-Update] Request:', { accountId, amount, description, userId: user.id });

        if (!accountId) {
            console.error('[Account API-Update] Missing Account ID');
            return res.status(400).json({ error: 'Account ID is required' });
        }

        // Fetch current account to get balance
        const { data: currentAccount, error: fetchError } = await supabase
            .from('accounts')
            .select('balance, id')
            .eq('id', accountId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !currentAccount) {
            console.error('Error fetching account for update:', fetchError);
            return res.status(500).json({ error: fetchError?.message || 'Account not found' });
        }

        console.log('[Account API-Update] Current Account Found:', currentAccount);
        const newBalance = (Number(currentAccount.balance) || 0) + (Number(amount) || 0);
        console.log('[Account API-Update] New Balance:', newBalance);

        // Update balance
        const { data: updatedAccount, error } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId)
            .eq('user_id', user.id)
            .select()
            .maybeSingle(); // Use maybeSingle to avoid error on 0 rows

        if (error) {
            console.error('Error updating balance:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!updatedAccount) {
            console.error('[Account API-Update] Update returned no rows! Check RLS policies.');
            return res.status(500).json({ error: 'Failed to update account balance' });
        }

        console.log('[Account API-Update] Update Success:', updatedAccount);

        // Record transaction
        const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
                account_id: currentAccount.id,
                amount: amount,
                type: 'income',
                description: description || 'Added money',

            });

        if (transactionError) {
            console.error('Error recording transaction:', transactionError);
            // We don't fail the request if transaction logging fails, but we log it
        }

        res.status(200).json({ success: true, account: updatedAccount });

    } catch (err: any) {
        console.error('Server error updating balance:', err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/withdraw-money', async (req, res) => {
    try {
        const supabase = createClient(req, res);

        // Check user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error('[Account API] Auth Error:', authError);
            const cookiesReceived = req.headers.cookie ? 'Yes (Length: ' + req.headers.cookie.length + ')' : 'No';
            return res.status(401).json({
                error: 'Unauthorized',
                details: authError,
                debug: { cookiesReceived }
            });
        }
        console.log('[Account API] User Authenticated:', user.id);

        const { accountId, amount, description } = req.body;

        console.log('[Account API-Withdraw] Request:', { accountId, amount, description, userId: user.id });

        if (!accountId) {
            console.error('[Account API-Withdraw] Missing Account ID');
            return res.status(400).json({ error: 'Account ID is required' });
        }

        // Fetch current account to get balance
        const { data: currentAccount, error: fetchError } = await supabase
            .from('accounts')
            .select('balance, id')
            .eq('id', accountId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !currentAccount) {
            console.error('Error fetching account for withdrawal:', fetchError);
            return res.status(500).json({ error: fetchError?.message || 'Account not found' });
        }

        console.log('[Account API-Withdraw] Current Account Found:', currentAccount);

        const currentBalance = Number(currentAccount.balance) || 0;
        const withdrawAmount = Number(amount) || 0;

        if (currentBalance < withdrawAmount) {
            return res.status(400).json({ error: 'Insufficient funds' });
        }

        const newBalance = currentBalance - withdrawAmount;
        console.log('[Account API-Withdraw] New Balance:', newBalance);

        // Update balance
        const { data: updatedAccount, error } = await supabase
            .from('accounts')
            .update({ balance: newBalance })
            .eq('id', accountId)
            .eq('user_id', user.id)
            .select()
            .maybeSingle();

        if (error) {
            console.error('Error updating balance:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!updatedAccount) {
            console.error('[Account API-Withdraw] Update returned no rows! Check RLS policies.');
            return res.status(500).json({ error: 'Failed to update account balance' });
        }

        console.log('[Account API-Withdraw] Update Success:', updatedAccount);

        if (error) {
            console.error('Error updating balance:', error);
            return res.status(500).json(error);
        }

        // Record transaction
        const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
                account_id: currentAccount.id,
                amount: amount,
                type: 'expense',
                description: description || 'Withdrew money',

            });

        if (transactionError) {
            console.error('Error recording transaction:', transactionError);
        }

        res.status(200).json({ success: true, account: updatedAccount });

    } catch (err: any) {
        console.error('Server error updating balance:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const supabase = createClient(req, res);

        // Check user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Fetch accounts
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Return the list (or singular if you prefer)
        res.status(200).json({ accounts: data });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
