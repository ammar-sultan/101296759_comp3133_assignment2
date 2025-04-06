const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
  Query: {
    hello: () => "Hello, GraphQL.",

    getAllEmployees: async () => {
      try {
        const employees = await Employee.find();
        return employees;
      } catch (error) {
        throw new Error("Unable to retrieve employees: " + error.message);
      }
    },

    getEmployeeById: async (_, { eid }) => {
      try {
        const employee = await Employee.findById(eid);
        if (!employee) throw new Error("Employee not found.");
        return employee;
      } catch (error) {
        throw new Error("Unable to retrieve employee: " + error.message);
      }
    },

    searchEmployees: async (_, { designation, department }) => {
      try {
        const employees = await Employee.find({
          $or: [{ designation }, { department }],
        });
        return employees;
      } catch (error) {
        throw new Error("Unable to search employees: " + error.message);
      }
    },
  },

  Mutation: {
    signup: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error(
            "Email already in use. Please log in or use a different email."
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        return {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          message: "Signup completed successfully. Please log in.",
        };
      } catch (error) {
        throw new Error("Unable to complete signup: " + error.message);
      }
    },

    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("User not found. Please sign up.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password. Please try again.");
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, username: user.username },
          "mySuperSecretKey",
          { expiresIn: "1h" }
        );

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          token,
          message: "Login successful.",
        };
      } catch (error) {
        throw new Error("Unable to complete login: " + error.message);
      }
    },

    addEmployee: async (_, { input }) => {
      try {
        const newEmployee = new Employee(input);
        await newEmployee.save();
        return {
          message: "Employee added successfully.",
          employee: newEmployee,
        };
      } catch (error) {
        throw new Error("Unable to add employee: " + error.message);
      }
    },

    updateEmployee: async (_, { eid, input }) => {
      try {
        const updatedEmployee = await Employee.findByIdAndUpdate(
          eid,
          { $set: input },
          { new: true }
        );
        if (!updatedEmployee) throw new Error("Employee not found.");
        return {
          message: "Employee updated successfully.",
          employee: updatedEmployee,
        };
      } catch (error) {
        throw new Error("Unable to update employee: " + error.message);
      }
    },

    deleteEmployee: async (_, { eid }) => {
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(eid);
        if (!deletedEmployee) throw new Error("Employee not found.");
        return "Employee deleted successfully.";
      } catch (error) {
        throw new Error("Unable to delete employee: " + error.message);
      }
    },
  },
};

module.exports = resolvers;
