import java.util.Scanner;

/**
 * Main application class to interact with the banking system.
 */
public class BankApplication {
    public static void main(String[] args) {
        Bank bank = new Bank();
        Scanner scanner = new Scanner(System.in);
        int choice;

        System.out.println("Welcome to the Banking Application System!");

        do {
            System.out.println("\n1. Create Savings Account");
            System.out.println("2. Create Current Account");
            System.out.println("3. Deposit");
            System.out.println("4. Withdraw");
            System.out.println("5. Display Account Details");
            System.out.println("6. Display All Accounts");
            System.out.println("7. Add Interest (Savings Only)");
            System.out.println("8. Exit");
            System.out.print("Enter your choice: ");
            
            try {
                choice = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                choice = 0;
            }

            switch (choice) {
                case 1:
                    System.out.print("Enter Account Number: ");
                    String saAccNum = scanner.nextLine();
                    System.out.print("Enter Account Holder Name: ");
                    String saName = scanner.nextLine();
                    System.out.print("Enter Initial Balance (Min 1000): ");
                    double saBalance = Double.parseDouble(scanner.nextLine());
                    bank.addAccount(new SavingsAccount(saAccNum, saName, saBalance));
                    break;
                case 2:
                    System.out.print("Enter Account Number: ");
                    String caAccNum = scanner.nextLine();
                    System.out.print("Enter Account Holder Name: ");
                    String caName = scanner.nextLine();
                    System.out.print("Enter Initial Balance: ");
                    double caBalance = Double.parseDouble(scanner.nextLine());
                    System.out.print("Enter Overdraft Limit: ");
                    double odLimit = Double.parseDouble(scanner.nextLine());
                    bank.addAccount(new CurrentAccount(caAccNum, caName, caBalance, odLimit));
                    break;
                case 3:
                    System.out.print("Enter Account Number: ");
                    String dAccNum = scanner.nextLine();
                    Account dAcc = bank.getAccount(dAccNum);
                    if (dAcc != null) {
                        System.out.print("Enter amount to deposit: ");
                        double amount = Double.parseDouble(scanner.nextLine());
                        dAcc.deposit(amount);
                    } else {
                        System.out.println("Account not found!");
                    }
                    break;
                case 4:
                    System.out.print("Enter Account Number: ");
                    String wAccNum = scanner.nextLine();
                    Account wAcc = bank.getAccount(wAccNum);
                    if (wAcc != null) {
                        System.out.print("Enter amount to withdraw: ");
                        double amount = Double.parseDouble(scanner.nextLine());
                        wAcc.withdraw(amount);
                    } else {
                        System.out.println("Account not found!");
                    }
                    break;
                case 5:
                    System.out.print("Enter Account Number: ");
                    String dispAccNum = scanner.nextLine();
                    Account dispAcc = bank.getAccount(dispAccNum);
                    if (dispAcc != null) {
                        dispAcc.displayDetails();
                    } else {
                        System.out.println("Account not found!");
                    }
                    break;
                case 6:
                    bank.displayAllAccounts();
                    break;
                case 7:
                    System.out.print("Enter Savings Account Number: ");
                    String iAccNum = scanner.nextLine();
                    Account iAcc = bank.getAccount(iAccNum);
                    if (iAcc instanceof SavingsAccount) {
                        System.out.print("Enter interest rate (%): ");
                        double rate = Double.parseDouble(scanner.nextLine());
                        ((SavingsAccount) iAcc).calculateInterest(rate);
                    } else {
                        System.out.println("Savings Account not found!");
                    }
                    break;
                case 8:
                    System.out.println("Thank you for using our banking system!");
                    break;
                default:
                    System.out.println("Invalid choice. Try again.");
            }
        } while (choice != 8);

        scanner.close();
    }
}
