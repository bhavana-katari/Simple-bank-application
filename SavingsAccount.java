/**
 * SavingsAccount class that inherits from Account.
 * Demonstrates inheritance and method overriding.
 */
public class SavingsAccount extends Account {
    private static final double MIN_BALANCE = 1000.0;

    public SavingsAccount(String accountNumber, String accountHolder, double initialBalance) {
        super(accountNumber, accountHolder, initialBalance);
        if (initialBalance < MIN_BALANCE) {
            System.out.println("Warning: Initial balance below minimum requirements.");
        }
    }

    /**
     * Overrides withdraw to enforce minimum balance.
     */
    @Override
    public void withdraw(double amount) {
        if (amount > 0 && (balance - amount) >= MIN_BALANCE) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount + ". New Balance: " + balance);
        } else {
            System.out.println("Insufficient funds or withdrawal would breach minimum balance of " + MIN_BALANCE);
        }
    }

    /**
     * Calculates and adds interest to the balance.
     */
    public void calculateInterest(double rate) {
        double interest = balance * (rate / 100);
        balance += interest;
        System.out.println("Interest added: " + interest + ". New Balance: " + balance);
    }

    @Override
    public void displayDetails() {
        System.out.println("--- Savings Account ---");
        super.displayDetails();
        System.out.println("Minimum Balance Required: " + MIN_BALANCE);
    }
}
