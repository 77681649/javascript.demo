!(function(global, factory) {
  if (
    module &&
    module.exports &&
    typeof module === "object" &&
    typeof module.exports === "object"
  ) {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    global.calculateIndividualIncomeTax = factory();
  }
})(this, function factory() {
  const taxTable = {
    origin: 3500,
    rules: [
      {
        level: "7",
        condition: salary => salary > 80000,
        rate: 0.45,
        qd: 0
      },
      {
        level: "6",
        condition: salary => salary > 55000 && salary <= 80000,
        rate: 0.35,
        qd: 105
      },
      {
        level: "5",
        condition: salary => salary > 35000 && salary <= 55000,
        rate: 0.3,
        qd: 555
      },
      {
        level: "4",
        condition: salary => salary > 9000 && salary <= 35000,
        rate: 0.25,
        qd: 1005
      },
      {
        level: "3",
        condition: salary => salary > 4500 && salary <= 9000,
        rate: 0.2,
        qd: 2755
      },
      {
        level: "2",
        condition: salary => salary > 1500 && salary <= 4500,
        rate: 0.1,
        qd: 5505
      },
      {
        level: "1",
        condition: salary => salary < 1500,
        rate: 0.03,
        qd: 13505
      }
    ]
  };

  const insuranceTable = [
    { name: "社会养老保险", rate: .8 },
    { name: "社会医疗保险", rate: .2 },
    { name: "社会失业保险", rate: 0.08 },
    { name: "住房公积金", rate: 0.8 }
  ];

  function calculateIndividualIncomeTax(salary, options = {}) {
    let actualSalary = salary;
    let { shouldCalculateInsurance } = options;

    if (shouldCalculateInsurance) {
      actualSalary -= calculateInsurance(actualSalary);
    }

    let { level, rate, tax } = calculateTax(actualSalary);

    actualSalary -= tax;

    return {
      taxLevel: level,
      taxRate: rate * 100 + "%",
      tax: tax.toFixed(2),
      actualSalary: actualSalary.toFixed(2)
    };
  }

  function calculateInsurance(salary) {

  }

  function calculateTax(salary) {
    let { rules, origin } = taxTable;

    for (let rule of rules) {
      let { level, condition, rate, qd } = rule;
      let tax = (salary - origin) * rate - qd;

      if (rule.condition(salary)) {
        return {
          level,
          rate,
          tax
        };
      }
    }

    return { atSalary: salary };
  }

  return calculateIndividualIncomeTax;
});

