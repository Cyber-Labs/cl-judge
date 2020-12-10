# CL-judge

**Online judge version 2.0**  
**API Documentation - [Postman](https://documenter.getpostman.com/view/7963087/TVKJwEH1)**  
[![Build Status](https://travis-ci.com/Cyber-Labs/cl-judge.svg?branch=master)](https://travis-ci.com/Cyber-Labs/cl-judge)

## Status
**Under Development**

## Maintained by

**Ridhish Jain - [@ridhishjain](https://github.com/ridhishjain)**

**Chirag Jain - [@cjchirag7](https://github.com/cjchirag7)**

## Index

- **[Requirements](#requirements)**
  - **[git](#git)**
  - **[nvm](#nvm-node-version-manager--node-model-supervisor)**
  - **[node](#node)**
  - **[npm](#npm-node-package-manager)**
  - **[yarn](#yarn)**
  - **[mysql-server](#mysql-server)**
  - **[Other requirements](#other-requirements-preferred-not-essential)**
- **[Tech Stack](#tech-stack)**
- **[Setup and installation](#setup-and-installation)**
  - **[Setting up the repository locally](#setting-up-the-repository-locally)**
  - **[Exporting the sql file](#exporting-the-sql-file)**
  - **[Setting up environment variables](#setting-up-environment-variables)**
- **[Git commands](#git-commands)**
- **[Development Workflow](#development-workflow)**

## Requirements

### GIT

- Version required for `git` - `git version 2.25.1` or higher
- Install `git` by:

```
sudo apt install git
```

- Check version by:

```
git --version
```

### NVM (Node Version Manager / Node Model Supervisor)

- Version required for `nvm` - `0.35.3` or higher
- Install `nvm` by:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```

- Check version by:

```
nvm --version
```

### NODE

- Version required for `node` - `v14.12.0` or higher
- Install `node` by:

```
nvm install node
```

- Check version by:

```
node --version
```

### NPM (Node Package Manager)

- Version required for `npm` - `6.14.8` or higher
- Install `npm` by:

```
sudo apt install npm
```

- Check version by:

```
npm --version
```

### YARN

- Version required for `yarn` - `1.22.5` or higher
- Install `yarn` by:

```
sudo apt install yarn
```

- Check version by:

```
yarn --version
```

### MySQL server

- Version required for `mysql-server` - `version 8.0.21` or higher
- Install `mysq-server` by:

```
sudo apt install mysql-server
```

- After, installation, the MySQL service will start automatically. To verify that the MySQL server is running:

```
sudo systemctl status mysql
```

- Output of the above command should look like:

```
● mysql.service - MySQL Community Server
     Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: enabled)
     Active: active (running) since Tue 2020-04-28 20:59:52 UTC; 10min ago
   Main PID: 8617 (mysqld)
     Status: "Server is operational"
     ...
```

- Finally invoke the secure installation by:

```
sudo mysql_secure_installation
```

- You will be asked to configure the VALIDATE PASSWORD PLUGIN which is used to test the strength of the MySQL users' passwords and improve the security:

```
Securing the MySQL server deployment.

Connecting to MySQL using a blank password.

VALIDATE PASSWORD COMPONENT can be used to test passwords
and improve security. It checks the strength of password
and allows the users to set only those passwords which are
secure enough. Would you like to setup VALIDATE PASSWORD component?

Press y|Y for Yes, any other key for No: y
```

- Enter `y`. There are three levels of password validation policy, low, medium, and strong.

```
There are three levels of password validation policy:

LOW    Length >= 8
MEDIUM Length >= 8, numeric, mixed case, and special characters
STRONG Length >= 8, numeric, mixed case, special characters and dictionary                  file

Please enter 0 = LOW, 1 = MEDIUM and 2 = STRONG: 2
```

- Enter `0`, `1`, or `2` as per requirements. On the next prompt, you will be asked to set a password for the MySQL root user:

```
Please set the password for root here.


New password:

Re-enter new password:
```

- The next prompt will be the script which will show you the strength of your new password:

```
Estimated strength of the password: 50
Do you wish to continue with the password provided?(Press y|Y for Yes, any other key for No) : y
```

- Enter `y` to continue. Next, you’ll be asked to remove the anonymous user, restrict root user access to the local machine, remove the test database, and reload privilege tables. You should answer `y` to all questions.
- To log in to the MySQL server as the root user type:

```
sudo mysql
```

- You will be presented with the MySQL shell:

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 12
Server version: 8.0.19-0ubuntu5 (Ubuntu)

Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

### Other requirements (preferred, not essential):

#### Postman

Download and and install postman by:

```
sudo apt install postman
```

#### VS Code

Download and install VS code by:

```
sudo snap install --classic code
```

#### MySQL Workbench

Download and install mysql workbench from [here](https://dev.mysql.com/downloads/workbench/).  
After downloading and installing workbench, access may be denied to localhost, the error will look like:

```
access denied for 'root'@'localhost'
```

This will probably happen in ubuntu 20.04 versions or higher. To solve it:
Open terminal and run:

```
sudo mysql
SELECT user,authentication_string,plugin,host FROM mysql.user;
```

The response will be like:

```
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
| user             | authentication_string                                                  | plugin                | host      |
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
| debian-sys-maint | $A$005$^�	D)0<j7b9#~jQyAmMc5EuvFkj3wxf1sJtGAbAAvm4XCKOCp.k5S/1d79 | caching_sha2_password | localhost |
| mysql.infoschema | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| mysql.session    | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| mysql.sys        | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| root             |                                                                        | auth_socket           | localhost |
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
5 rows in set (0.00 sec)
```

The problem lies in `auth-socket` plugin and to change it to `mysql_native_password`, run:

```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '<Your Passowrd>';
FLUSH PRIVILEGES;
```

Then refresh and again run the command:

```
SELECT user,authentication_string,plugin,host FROM mysql.user;
```

The response this time will be:

```
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
| user             | authentication_string                                                  | plugin                | host      |
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
| debian-sys-maint | $A$005$^�	D)0<j7b9#~jQyAmMc5EuvFkj3wxf1sJtGAbAAvm4XCKOCp.k5S/1d79 | caching_sha2_password | localhost |
| mysql.infoschema | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| mysql.session    | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| mysql.sys        | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password | localhost |
| root             | *1B9D6B681B44F7AE2A6976FD7249F0204E6D2FA4                              | mysql_native_password | localhost |
+------------------+------------------------------------------------------------------------+-----------------------+-----------+
5 rows in set (0.00 sec)
```

After changing the auth-socket, close workbench and open it again. The `root@localhost` should be accessible now.

## Tech Stack

- **Frontend design and development - `ReactJS`, `NextJS`**
- **Server and API development - `NodeJS`, `ExpressJS`**
- **Unit testing - `Mocha`**
- **End to End API testing - `Jest`**
- **Continuous Integration and testing - `Travis CI`**
- **Database - `MySQL`**
- **API Documentation - `Postman`**
- **Frontend hosting and deployment - `Netlify`**
- **Server hosting and deployment - `Azure`**

## Setup and Installation

### Setting up the repository locally

1. First fork the repo to your account.  
   Go to the forked repo and clone it to your local machine:

```
git clone https://github.com/<your_username>/cl-judge.git
```

This will make a copy of the code to your local machine.

2. Now move to the `cl-judge` directory.

```
cd cl-judge
```

3. Now check the remote of your local code by:

```
git remote -v
```

The response should look like:

```
origin	https://github.com/<username>/cl-judge.git (fetch)
origin	https://github.com/<username>/cl-judge.git (push)
```

To add upstream to remote, run:

```
git remote add upstream https://github.com/Cyber-Labs/cl-judge.git
```

Again run `git remote -v`, the response should look like:

```
origin	https://github.com/<username>/cl-judge.git (fetch)
origin	https://github.com/<username>/cl-judge.git (push)
upstream	https://github.com/Cyber-Labs/cl-judge (fetch)
upstream	https://github.com/Cyber-Labs/cl-judge (push)
```

4. Once the remote is set, install all the necessary dependencies in both `frontend` and `server` packages:

```
cd frontend
npm install
cd ..
cd server
npm install
```

5. Before pushing to the repository, check linting by running:

```
cd server && npm run lint
cd frontend && npm run lint
```

If the errors are fixable, run:

```
cd server && npm run lint -- --fix
cd frontend && npm run lint -- --fix
```

### Exporting the sql file

1. Open MySQL Workbench and login with the `root` user
2. Create a schema named `cl_judge`.
3. Now, run the query as given in `database.sql` file, to create and initialize the required tables.

### Setting up environment variables

- In the server folder, create a copy of the `example.env` file as `.env`:

```
cp example.env .env
```

- In the `.env` file, make sure you fill all the environment variables.

## Git commands

Forcefully making `origin` even with `upstream`

```
git fetch upstream
git reset --hard upstream/master
git push origin master --force
```

## Development workflow

- Before starting development user must create a branch from master for the assigned issue using the following command :

```
git checkout master
git checkout -b <feature-name>
```

- After finishing development on an assigned issue, user will create a merge request for master branch.
