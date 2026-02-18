/**
 * CurrentAccount class that inherits from Account.
 * Demonstrates inheritance, polymorphism, and method overriding.
 */
public class CurrentAccount extends Account {
    private double overdraftLimit;

    public CurrentAccount(String accountNumber, String accountHolder, double initialBalance, double overdraftLimit) {
        super(accountNumber, accountHolder, initialBalance);
        this.overdraftLimit = overdraftLimit;
    }

    /**
     * Overrides withdraw to allow for overdraft facility.
     */
    @Override
    public void withdraw(double amount) {
        if (amount > 0 && amount <= (balance + overdraftLimit)) {
            balance -= amount;
            System.out.println("Withdrawn: " + amount + ". New Balance: " + balance);
        } else {
            System.out.println("Withdrawal exceeds overdraft limit of " + overdraftLimit);
        }
    }

    @Override
    public void displayDetails() {
        System.out.println("--- Current Account ---");
        super.displayDetails();
        System.out.println("Overdraft Limit: " + overdraftLimit);
    }
}
