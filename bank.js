// Level 1: Bank Class
class Bank {
  constructor(name) {
    if (!name) throw new Error("Bank name is required.");
    this.name = name;
    this.branches = [];
  }

  addBranch(branch) {
    if (!(branch instanceof Branch)) return false;
    if (this.branches.includes(branch)) return false;
    this.branches.push(branch);
    return true;
  }

  checkBranch(branch) {
    return this.branches.includes(branch);
  }

  addCustomer(branch, customer) {
    if (!this.checkBranch(branch)) return false;
    return branch.addCustomer(customer);
  }

  addCustomerTransaction(branch, customerId, amount) {
    if (!this.checkBranch(branch)) return false;
    return branch.addCustomerTransaction(customerId, amount);
  }

  findBranchByName(branchName) {
    var matches = this.branches.filter(function (b) {
      return b.getName().toLowerCase().indexOf(branchName.toLowerCase()) !== -1;
    });
    return matches.length > 0 ? matches : null;
  }

  listCustomers(branch, includeTransactions) {
    if (!this.checkBranch(branch)) return;
    var customers = branch.getCustomers();
    customers.forEach(function (c) {
      console.log("Customer: " + c.getName() + " (ID: " + c.getId() + ")");
      if (includeTransactions) {
        console.log("Transactions:");
        c.getTransactions().forEach(function (t) {
          console.log("  - " + t.amount + " on " + t.date.toLocaleString());
        });
        console.log("Balance: " + c.getBalance());
      }
    });
  }
}

// Level 1: Branch Class
class Branch {
  constructor(name) {
    if (!name) throw new Error("Branch name is required.");
    this.name = name;
    this.customers = [];
  }

  getName() {
    return this.name;
  }

  getCustomers() {
    return this.customers;
  }

  addCustomer(customer) {
    if (
      this.customers.some(function (c) {
        return c.id === customer.id;
      })
    )
      return false;
    this.customers.push(customer);
    return true;
  }

  addCustomerTransaction(customerId, amount) {
    var customer = this.customers.find(function (c) {
      return c.id === customerId;
    });
    if (!customer) return false;
    return customer.addTransactions(amount);
  }
}

// Level 1: Customer Class
class Customer {
  constructor(name, id) {
    if (!name || typeof id !== "number")
      throw new Error("Invalid customer data.");
    this.name = name;
    this.id = id;
    this.transactions = [];
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getTransactions() {
    return this.transactions;
  }

  getBalance() {
    return this.transactions.reduce(function (sum, t) {
      return sum + t.amount;
    }, 0);
  }

  addTransactions(amount) {
    if (typeof amount !== "number") return false;
    var newBalance = this.getBalance() + amount;
    if (newBalance < 0) return false;
    this.transactions.push(new Transaction(amount));
    return true;
  }
}

// Level 1: Transaction Class
class Transaction {
  constructor(amount, date) {
    if (typeof amount !== "number") throw new Error("Invalid amount.");
    this.amount = amount;
    this.date = date || new Date();
  }
}

// Level 2: Sample Data & Validation Testing
const arizonaBank = new Bank("Arizona");
const westBranch = new Branch("West Branch");
const sunBranch = new Branch("Sun Branch");
const customer1 = new Customer("John", 1);
const customer2 = new Customer("Anna", 2);
const customer3 = new Customer("John", 3);

arizonaBank.addBranch(westBranch); // returns false
arizonaBank.addBranch(sunBranch); // returns false
arizonaBank.addBranch(westBranch); // returns false

arizonaBank.findBranchByName("bank"); // returns null
arizonaBank.findBranchByName("sun"); // returns Branch {name: 'Sun Branch', customers: Array(2)}length: 1

arizonaBank.addCustomer(westBranch, customer1); // returns false
arizonaBank.addCustomer(westBranch, customer3); // returns false
arizonaBank.addCustomer(sunBranch, customer1); // returns false
arizonaBank.addCustomer(sunBranch, customer2); // returns false

arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 3000); // returns true
arizonaBank.addCustomerTransaction(westBranch, customer1.getId(), 2000); // returns true
arizonaBank.addCustomerTransaction(westBranch, customer2.getId(), 3000); // returns false

customer1.addTransactions(-1000); // returns true
console.log(customer1.getBalance()); // returns 8000
console.log(arizonaBank.listCustomers(westBranch, true)); // returns customers details and transactions
console.log(arizonaBank.listCustomers(sunBranch, true)); // returns customers details and transactions

// Level 3: Search Functionality
function searchCustomerByName(branch, name) {
  return branch.getCustomers().filter(function (c) {
    return c.getName().toLowerCase().indexOf(name.toLowerCase()) !== -1;
  });
}

console.log(
  "\nSearch for 'john' in West Branch:",
  searchCustomerByName(westBranch, "john")
);
