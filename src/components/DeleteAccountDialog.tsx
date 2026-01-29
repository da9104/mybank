import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function DeleteAccountDialog({ deleteDialogOpen, setDeleteDialogOpen, handleDeleteAccount }: { deleteDialogOpen: boolean; setDeleteDialogOpen: (open: boolean) => void; handleDeleteAccount: () => void }) {
    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete your account?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="delete-btn" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}