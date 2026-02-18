import java.util.ArrayList;
import java.util.List;

/**
 * Bank class to manage multiple accounts.
 */
public class Bank {
    private List<Account> accounts;

    public Bank() {
        accounts = new ArrayList<>();
    }

    public void addAccount(Account account) {
        accounts.add(account);
        System.out.println("Account added successfully: " + account.getAccountNumber());
    }

    public Account getAccount(String accountNumber) {
        for (Account account : accounts) {
            if (account.getAccountNumber().equals(accountNumber)) {
                return account;
            }
        }
        return null;
    }

    public void displayAllAccounts() {
        if (accounts.isEmpty()) {
            System.out.println("No accounts found in the system.");
        } else {
            System.out.println("--- All Bank Accounts ---");
            for (Account account : accounts) {
                account.displayDetails();
                System.out.println("-------------------------");
            }
        }
    }
}
