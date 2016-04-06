# FastLine

1) Run the server
- Pull the git repo.
- npm install the packages according to package.json
- Download mongodb
- run mongod inside the directory of mongodb/bin
- the db should be set up at localhost:27017
- create a directory called data and a new directory called db within at root directory
- run script: node app.js
- Open browser and go to localhost:3000
- You can user FastLine now

2) 
(Customer View)
You will see a login page.
-Use facebook account to login as a customer to buy food.
- Or register as a customer by clicking the register button.

-Once you login, you are in home page now.
*You can check you profile info and edit it by click the profile on the menu bar.
*Search food name/ Type of food, the result will be shown.
*You can order food by clicking order now. And you can choose any trucks to order
*Once you get into one truck page, you can order food by selecting quantity of dishes and 
  make comment of the truck as well.
*If you order food and chose the payment method, you are redirected to a thank-you page showing your order details.
*logout at the menu bar.

(Seller View)
-Login if yo u have an account
-or Register as a seller by clicking the register button.

Once you login,
*You can see your profile and edit button, also you can view your latest order.
*And you can check out your own page at the menu bar, also you can make comment and view your menu on your page.
*Logout at the menu bar.

(admin view)
-Admin account: admin@fastline.com, password: adminfastline
-You can login to clear the database.
-And logout.


