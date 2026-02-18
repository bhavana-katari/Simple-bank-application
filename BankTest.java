/**
 * Automated test script to verify banking operations.
 */
public class BankTest {
    public static void main(String[] args) {
        System.out.println("Running Automated Tests...\n");

        // Test SavingsAccount
        System.out.println("--- Testing SavingsAccount ---");
        SavingsAccount sa = new SavingsAccount("SA001", "John Doe", 1500);
        sa.displayDetails();
        sa.deposit(500); // 2000
        sa.withdraw(1001); // Should fail (min balance 1000)
        sa.withdraw(500); // Should succeed (1500)
        sa.calculateInterest(5); // 1500 + 75 = 1575
        sa.displayDetails();

        // Test CurrentAccount
        System.out.println("\n--- Testing CurrentAccount ---");
        CurrentAccount ca = new CurrentAccount("CA001", "Jane Smith", 1000, 500);
        ca.displayDetails();
        ca.withdraw(1200); // Should succeed (overdraft 500)
        ca.withdraw(400); // Should fail (total 1600 > 1500)
        ca.deposit(200);
        ca.displayDetails();

        // Test Polymorphism
        System.out.println("\n--- Testing Polymorphism ---");
        Account acc1 = new SavingsAccount("SA002", "Poly Sav", 2000);
        Account acc2 = new CurrentAccount("CA002", "Poly Cur", 1000, 500);

        System.out.println("Withdrawing 1500 from Savings (Poly):");
        acc1.withdraw(1500); // Should fail
        System.out.println("Withdrawing 1500 from Current (Poly):");
        acc2.withdraw(1500); // Should succeed

        System.out.println("\nTests Completed.");
    }
}
