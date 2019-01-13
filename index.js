
/**
	*  Constructor that executes when the index.html gets loaded
	*/
var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},

	bindEvents : function() {
		$(document).ready(function() {
      $(window).load(function() {
				var user = JSON.parse(localStorage.getItem("User_Details"));
				if (user == null)
					$("#HiUser").empty();
				else
					$("#HiUser").append("<b> Hi, " + user.customername + " !</b>");
				getList();
			});
		});
	}


};

app.initialize();

/**
	* Callback function of getList() when all Books from DB needs to be printed in index.html
	*/
function bookListJsonDataParse(json) {

	var mylist = $("#book_listId");
	mylist.empty();
	var tempOpt;
	tempOpt = '<h3> Featured Books </h3>';
	mylist.append(tempOpt);
	$.each(json, function(key, value) {

	tempOpt =
				'<li class="span4">' +
					  '<div class="thumbnail">' +
						'<a class="zoomTool" href="/OnlineBookStore/ProductInfoServlet?bookid='+ value.bookid +'" title="add to cart"><span class="icon-search"></span> QUICK VIEW</a>' +
						'<a class="defaultBtn" href="product_details.html" title="Click to view"><img src="'+ value.image +'" alt="'+ value.title +'"></a>' +
						'<div class="caption cntr">' +
						  '<h5>'+ value.title +'</h5>' +
						  '<h4>' +
							'<span> $'+ value.price +'</span>' +
							//'<h4><a class="shopBtn" href="/OnlineBookStore/Cart?title='+ value.title +'&price='+ value.price +'&author='+ value.author +'&bookid='+ value.bookid +'&image='+ value.image +'&operation=add" title="add to cart"> Add to cart </a></h4>' +
							'<button class="shopBtn" onclick="CartFunction(\'' + value.title + '\',\'' + value.price + '\',\'' + value.author +  '\',\'' + value.bookid  + '\',\'' + value.image + '\')">Add to Cart</button>' +
						  '</h4>' +
						'</div>' +
					  '</div>' +
					'</li>' +
				 '</ul><br>';
		  mylist.append(tempOpt);

	});

}

/**
	* Calling the servlet that returns json data through ajax.
	* we are using data type jsonp
	*/
function getList() {

	$.ajax({

		type : "GET",
		url : "https://192.168.43.9:8443/OnlineBookStore/allBook",
		dataType : 'jsonp',
		jsonpCallback : 'bookListJsonDataParse', // the Callback function
		error : function() {
			alert("Errr is occured");
		}
	});
}


/**
	*	Function to select the category and call the servlet with the selected category
	*/
function CategoryFunction() {
	   var category;
	   var idx = document.getElementById("selectCategory").selectedIndex;

	   switch(idx) {

		case 0:
			getList();
			break;

		case 1:
			category = "Biography";
			getCategoryBooks(category);
			break;
		case 2:
			category = "Business";
			getCategoryBooks(category);
			break;
		case 3:
			category = "Finance";
			getCategoryBooks(category);
			break;
		case 4:
			category = "Fashion";
			getCategoryBooks(category);
			break;
		case 5:
			category = "Computers";
			getCategoryBooks(category);
			break;
		case 6:
			category = "History";
			getCategoryBooks(category);
			break;
		case 7:
			category = "Home";
			getCategoryBooks(category);
			break;
		case 8:
			category = "Crafts and Hobbies";
			getCategoryBooks(category);
			break;
		case 9:
			category = "Romance";
			getCategoryBooks(category);
			break;
		case 10:
			category = "Science and Nature";
			getCategoryBooks(category);
			break;
		case 11:
			category = "Poetry";
			getCategoryBooks(category);
			break;
		case 12:
			category = "Comics";
			getCategoryBooks(category);
			break;
		case 13:
			category = "Food and Wine";
			getCategoryBooks(category);
			break;
	   }
	 }

	 /**
	 	*	Function to invoke categoryviewservlet and display the books of that category
		*/
	 function getCategoryBooks(category) {

	   $.get("https://192.168.43.9:8443/OnlineBookStore/categoryviewservlet", {Category : category}, function(data) {
			var mylist = $("#book_listId");
			mylist.empty();
			var tempOpt;
			tempOpt = '<h3>' + category +'</h3>';
			mylist.append(tempOpt);
			$.each(data, function(key, value) {
			tempOpt =
				'<li class="span4">' +
					  '<div class="thumbnail">' +

						'<a class="zoomTool" href="/OnlineBookStore/ProductInfoServlet?bookid='+ value.bookid +'" title="add to cart"><span class="icon-search"></span> QUICK VIEW</a>' +
						'<a class="defaultBtn" href="product_details.html" title="Click to view"><img src="'+ value.image +'" alt="'+ value.title +'"></a>' +
						'<div class="caption cntr">' +
						  '<h5>'+ value.title +'</h5>' +
						  '<h4>' +
							'<span> $'+ value.price +'</span>' +
							'<button class="shopBtn" onclick="CartFunction(\'' + value.title + '\',\'' + value.price + '\',\'' + value.author +  '\',\'' + value.bookid  + '\',\'' + value.image + '\')">Add to Cart</button>' +
						  '</h4>' +
						'</div>' +
					  '</div>' +
					'</li>' +
				 '</ul><br>';
			mylist.append(tempOpt);
			});
		});
}


/**
	* Cart Implementation
	* Equivalent to CartControllerServlet
	* Reference: https://github.com/soggybag/Shopping-Cart-js
	*/
var shoppingCart = (function(){
		//Cart array that saves all the books in cart
    var cart=[];

		//holds one book information in the cart
		function cartItem(title, price, author, bookid, image, quantity){
			this.title= title;
			this.price= price;
			this.author= author;
			this.bookid= bookid;
			this.image= image;
			this.quantity= quantity;
		}

		//Stores the cart into localStorage
		//localStorage is the equivalent of HTTPSession
		function saveCart() {
			localStorage.setItem("Items_in_Cart", JSON.stringify(cart));

		}

		//retrieves all the books in the cart array
		function loadCart() {
			cart = JSON.parse(localStorage.getItem("Items_in_Cart"));
			if(cart===null) {
				cart=[];
			}
		}

		loadCart();

		var obj={};

		//Add a book in cart array
    obj.addItemToCart = function(title, price, author, bookid, image) {
			for(var i in cart){
				if(cart[i].title===title){
					cart[i].quantity= cart[i].quantity + 1
					saveCart();
					return;
				}
			}

			var item= new cartItem(title, price, author, bookid, image, 1);
			cart.push(item);
			saveCart();
		};

		//Iterate through the cart array and return it
		obj.listCart = function () {
				return cart;
			// var cartCopy = [];
			// for (var i in cart) {
			// 		// var item = cart[i];
			// 		// var itemCopy = {};
			// 		// for (var p in item) {
			// 		// 		itemCopy[p] = item[p];
			// 		// }
			// 		//cartCopy.push(itemCopy);
			// 		cartCopy.push(i);
			// }
		};

		//Empty the Cart
		obj.clearCart = function () {
        cart = [];
        saveCart();
    }

		//Delete only one item from the cart array
		obj.deleteItemFromCart= function(title) {

			for(var i in cart){
				if(cart[i].title===title){
					cart[i].quantity = cart[i].quantity - 1;
					if(cart[i].quantity===0) {
	           cart.splice(i,1);
					 }
					 break;
				}
			}
					saveCart();
		};

		//Calculate the total price of all books in cart
		obj.totalCart = function () {
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].quantity;
        }
        return totalCost.toFixed(2);
    };

return obj;
})();

/**
	* Method to display saved cart
	*/
function displayCart() {
	var cartArray = shoppingCart.listCart();
	var output = '<div class="row span12 well well-small"><h3>Cart Items</h3><hr class="soften"/>'+
								'<table class="table table-bordered table-condensed">'+
                '<thead>'+
                '<tr>'+
                  '<th>Product</th>'+
                  '<th>Description</th>'+
                  '<th>Unit price</th>'+
                  '<th>Qty </th>'+
									'</tr>'+
              '</thead>'+
              '<tbody>';
	for (var i in cartArray) {
			output += "<tr>"
			    + "<td> <img width='35' src='" + cartArray[i].image + "'></td>"
					+ "<td>" + cartArray[i].title + "<br> Author: " + cartArray[i].author + "</br></td>"
					+ "<td>" + cartArray[i].price + "</td>"
					+ "<td>" + cartArray[i].quantity
					+ "<button class='plus-item btn btn-mini btn-danger' data-title='"
					+cartArray[i].title+ "' data-price='" + cartArray[i].price + "' data-author='" + cartArray[i].author +
					"' data-bookid='" + cartArray[i].bookid + "' data-image='" + cartArray[i].image +"'>+</button>"
					+" <button class='subtract-item btn btn-mini btn-danger' data-name='"
			 		+cartArray[i].title+"'>-</button>"+
					"</td></tr>";
	}
	output += " <tr> " +
            "<td >Total products:	</td>" +
            "<td></td>" +
            "<td></td>" +
            "<td>"+ shoppingCart.totalCart() +"</td> " +
            "<td></td>" +
            "</tr>"
	output += "</tbody></table></div>";
	output += '<button id="checkout" class="shopBtn btn-large pull-right icon-arrow-right" onclick="checkoutCart()">Checkout</button>';
	var checkout_button = document.getElementById("checkout");
	var totalPrice = shoppingCart.totalCart();

	var mylist = $("#book_listId");
	mylist.empty();
	mylist.append(output);
}

	/**
		* JQuery function to subtract the quantity of the book in cart
		*/
	$("#book_listId").on("click", ".subtract-item", function(event){
			var title = $(this).attr("data-name");
			shoppingCart.deleteItemFromCart(title);
			displayCart();
	});

	/**
		* JQuery function to add the quantity of the book in cart
		*/
	$("#book_listId").on("click", ".plus-item", function(event){
			var title = $(this).attr("data-title");
			var price = $(this).attr("data-price");
			var author = $(this).attr("data-author");
			var bookid = $(this).attr("data-bookid");
			var image = $(this).attr("data-image");

			shoppingCart.addItemToCart(title, price, author, bookid, image);
			displayCart();
	});

/**
	* Function that calls the cart Implementation
	* Called when user clicks "Add to Cart" Button
	*/
function CartFunction(title, price, author, bookid, image) {
	shoppingCart.addItemToCart(title, price, author, bookid, image);
	displayCart();

}

/**
	* Called when "checkout" button is clicked
	* Displays login page if user has not logged in already
	* Otherwise, displays the order details
	*/
function checkoutCart() {
	var login;
  var CustomerDetails = JSON.parse(localStorage.getItem("User_Details"));
	if (CustomerDetails == null)
	{
	login = '<div class="row">' +
			'<div class="well">' +
			'<h3>LOGIN</h3>'+
			'<form id="LoginUser">' +
			  '<div class="control-group">' +
				'<label class="control-label" for="inputEmail">Email</label>' +
				'<div class="controls">' +
				  '<input class="span4" id="email" name="username" type="text" placeholder="Email" required>' +
				'</div>' +
			  '</div>' +
			  '<div class="control-group">' +
				'<label class="control-label" for="inputPassword">Password</label>' +
				'<div class="controls">' +
				  '<input type="password" id="password" name="pwd" class="span4" placeholder="Password" required>' +
				'</div>' +
			  '</div>' +
			  '<div class="control-group">'+
				'<div class="controls">'+
				  '<button onclick="LoginUser()" class="defaultBtn">Sign in</button><br>'+
				  '<p>Not Registered? Register Now</p>' +
				'</div>'+
			  '</div>'+
			'</form>' +
			'<button onclick="RegisterButton()" class="defaultBtn">Register</button>'+
		'</div>'+
	'</div>';
	var mylist = $("#book_listId");
	mylist.empty();
	mylist.append(login);
  }
  else {
		$("#loginErrMsg").empty();
	OrderSummary();
  }
}

/**
	* Called when the user clicks the "Login" button
	* If login is successful, order details page is displayed
	* Otherwise, user is prompted to login or Register
	*/
function LoginUser() {
	var UserName = $("input#email").val();
	var PassWord = $("input#password").val();
	var login;
	$("#loginErrMsg").empty();
	var mylist = $("#book_listId");
	mylist.empty();
	// login = '<div id="loginMsg"> </div>';
	$.get("https://192.168.43.9:8443/OnlineBookStore/LoginUserServlet", {email : UserName, password : PassWord}, function(data) {
		if(data.customeremail === UserName)
		{
			localStorage.setItem("User_Details", JSON.stringify(data));
			var loginName = $("#HiUser");
			loginName.append("<b> Hi, " + data.customername + " !</b>");
			OrderSummary();

		}
		else
		{
			var lgnErrMsg = $("#loginErrMsg");
			lgnErrMsg.append('<h4 style="color:red"> Login Unsuccessful! </h4>');
			checkoutCart();

		}
	});
}

/**
	* Displays the registration form
	*/
function RegisterButton() {

	var register;
	$("#loginErrMsg").empty();
	register = '<form>' +
	'<hr class="soft"/>' +
	'<div class="well">' +
		'<h3>Your Personal Details</h3>' +
		'<div class="control-group">' +
			'<label class="control-label" for="inputFname">First name <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="fname" id="fname" placeholder="First Name" required>' +
			'</div>' +
		 '</div>' +
		 '<div class="control-group">' +
			'<label class="control-label" for="inputLname">Last name <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="lname" id="lname" placeholder="Last Name" required>' +
			'</div>' +
		 '</div>' +
		'<div class="control-group">' +
		'<label class="control-label" for="inputEmail">Email <sup>*</sup></label>' +
		'<div class="controls">' +
		  '<input type="email" name="email" id="reg_email" placeholder="Email" required>' +
		'</div>' +
	  '</div>	  ' +
		'<div class="control-group">' +
		'<label class="control-label">Password <sup>*</sup></label>' +
		'<div class="controls">' +
		  '<input type="password" name="pwd" id="pwd1" placeholder="Password" required>' +
		'</div>' +
	  '</div>' +
	  '<div class="control-group">' +
		'<label class="control-label">Confirm Password <sup>*</sup></label>' +
		'<div class="controls">            ' +
		  '<input type="password" id="pwd2" placeholder="Password" onkeyup="checkPass(); return false;" required>' +
		  '<span id="confirmMessage" class="confirmMessage"></span>' +
		'</div>' +
	  '</div>' +
	'</div>' +
		'<div class="well">' +
		'<h3>Your Address Details</h3>' +
		'<div class="control-group">' +
			'<label class="control-label">Street <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="street" id="street" placeholder=" Street" required>' +
			'</div>' +
		'</div>' +
		'<div class="control-group">' +
			'<label class="control-label">City <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="city" id="city" placeholder="City" required>' +
			'</div>' +
		'</div>' +
		 '<div class="control-group">' +
			'<label class="control-label">Province <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="province" id="province" placeholder="Province" required>' +
			'</div>' +
		'</div>' +
		'<div class="control-group">' +
			'<label class="control-label">Country <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="country" id="country" placeholder="Country" required>' +
			'</div>' +
		'</div>' +
		'<div class="control-group">' +
			'<label class="control-label">ZIP <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="zip" id="zip" placeholder="ZIP" required>' +
			'</div>' +
		'</div>' +
		'<div class="control-group">' +
			'<label class="control-label">Phone <sup>*</sup></label>' +
			'<div class="controls">' +
			  '<input type="text" name="phone" id="phone" placeholder="phone" required>' +
			'</div>' +
		'</div>' +
		'<div class="control-group">' +
		'<div class="controls">' +
		 '<button name="submitAccount" value="Register" class="shopBtn exclusive" onclick="RegisterUser()">Register</button>' +
		'</div>' +
	'</div>' +
	'</div>' +
	'</form>';

	var ml = $("#book_listId");
	ml.empty();
	ml.append(register);
}

/**
	* Called when user clicks on "Register" button
	* If registration is successful, user is prompted to login
	* Otherwise, existing users are prompted to login
	*/
function RegisterUser() {
	var mylist = $("#book_listId");
	var Fname = $("input#fname").val();
	var Lname = $("input#lname").val();
	var Reg_email = $("input#reg_email").val();
	var Pwd1 = $("input#pwd1").val();
	var Street = $("input#street").val();
	var City = $("input#city").val();
	var Province = $("input#province").val();
	var Zip = $("input#zip").val();
	var Phone = $("input#phone").val();
	var Country = $("input#country").val();
	mylist.empty();

	$.get("https://192.168.43.9:8443/OnlineBookStore/RegisterControllerServlet",
		{
			fname : Fname,
			lname : Lname,
			email : Reg_email,
			pwd : Pwd1,
			street : Street,
			city : City,
			province : Province,
			zip : Zip,
			phone : Phone,
			country : Country
		},
		function(data) {
			if(data.ValidRegister === false)
			{
				var lgnErrMsg = $("#loginErrMsg");
				lgnErrMsg.append('<h4> Registration UnSuccessful!! </h4>');
				checkoutCart();
			}
			else {
				mylist.append('<h3> Registered Successfully!! </h3>');
				mylist.append('<button onclick="checkoutCart()" class="defaultBtn">Login Now!</button>');

			}

	});
}

/**
	* Checks if two passwords entered while registration match or not
	*/
function checkPass() {
    //Store the password field
    var password1 = document.getElementById('pwd1');
    var password2 = document.getElementById('pwd2');
    var message = document.getElementById('confirmMessage');

    //Set the colors
    var goodColor = "#66cc66";
    var badColor = "#ff6666";

    //Compare the password fields
    if(password1.value == password2.value){
        //The passwords match.
        password2.style.backgroundColor = goodColor;
        message.style.color = goodColor;
        message.innerHTML = "Passwords Match!"
    }
    else{
        //The passwords do not match.
        password2.style.backgroundColor = badColor;
        message.style.color = badColor;
        message.innerHTML = "Passwords Do Not Match!"
    }
}

/**
	* Function to display order details in UI
	* Calls CreateOrderServlet which creates an order in purchaseOrder table in DB
	*/
function OrderSummary() {
	var CustomerDetails = JSON.parse(localStorage.getItem("User_Details"));
	var CustomerId = CustomerDetails.customerid;
	var cartTotal = shoppingCart.totalCart();
  var orderDetails;
	var mylist = $("#book_listId");
	mylist.empty();
	var grandTotal = cartTotal * 1.13 + 10.50;

	$.get("https://192.168.43.9:8443/OnlineBookStore/CreateOrderServlet",
	{
		customerid : CustomerId,
		cart_total : cartTotal
	},
	function(data) {
		var addr = JSON.parse(data.Address);
		localStorage.setItem("Poid", data.Poid);

    //orderDetails output
		var cartArray = shoppingCart.listCart();
		var output = '<div class="row span12 well well-small"><h3>Order Details</h3><hr class="soften"/>'+
									'<table class="table table-bordered table-condensed">'+
	                '<thead>'+
	                '<tr>'+
	                  '<th>Product</th>'+
	                  '<th>Description</th>'+
	                  '<th>Unit price</th>'+
	                  '<th>Qty </th>'+
										'</tr>'+
	              '</thead>'+
	              '<tbody>';
		for (var i in cartArray) {
				output += "<tr>"
				    + "<td> <img width='35' src='" + cartArray[i].image + "'></td>"
						+ "<td>" + cartArray[i].title + "<br> Author: " + cartArray[i].author + "</br></td>"
						+ "<td>" + cartArray[i].price + "</td>"
						+ "<td>" + cartArray[i].quantity +
						"</td></tr>";
		}
		output += " <tr> " +
	            "<td >Total products:	</td>" +
	            "<td></td>" +
	            "<td></td>" +
	            "<td>"+ shoppingCart.totalCart() +"</td> " +
	            "<td></td>" +
	            "</tr>"
		output += "</tbody></table></div>";

    output += '<table class="table table-bordered table-condensed">' +
            '<tr>' +
            '<th>Name:</th>' +
            '<td>' + CustomerDetails.customername + '</td>' +
            '</tr>' +
            '<tr>' +
            '<th rowspan="4">Address:</th>' +
            '<td>' + addr.street + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' + addr.city + '</td> ' +
            '</tr>' +
            '<tr>' +
            '<td>' + addr.province + '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' + addr.country + '</td>' +
            '</tr>' +
            '</table>';

		output += '<table class="table table-bordered table-condensed">' +
						'<tr>' +
						'<th>Total Amount</th>' +
						'</tr>' +
						'<tr>' +
						'<th>Total Price:</th>' +
						'<td> CAD ' + cartTotal + '</td>' +
						'</tr>' +
						'<tr>' +
						'<th>Shipping:</th>' +
						'<td>CAD 10.50</td> ' +
						'</tr>' +
						'<tr>' +
						'<th>Tax(13%):</th>' +
						'<td> CAD ' + cartTotal*0.13 + '</td>' +
						'</tr>' +
						'<tr>' +
						'<th>Grand Total:</th>' +
						'<td> CAD ' + grandTotal + '</td>' +
						'</tr>' +
						'</table>' + '<div id= "proceedDivId">' +
						'<button id="proceedButton" style="display:block" class="shopBtn pull-right" onclick="showProceed()">Proceed for Payment</button>' +
						'</div>';

		mylist.append(output);
	});

}
/*
	* Called when "Proceed to Payment" button is clicked
	* User needs to input Credit Card Details
	*/
function showProceed(){
	console.log("entered show proceed");
	var mylist = $("#proceedDivId");
	mylist.empty();
  var output = '<div class="well well-small">' +
	'<h4><br><br>Credit Card Details</h4> <br>' +
	'<hr class="soften"/>' +
	'<table class="table table-bordered table-condensed">' +
		'<tr>' +
		'<th>Name on Card: </th>' +
		'<td><input type="Text" required></td>' +
		'</tr>' +
		'<tr>'+
		'<th>Card Number: </th>'+
		'<td><input type="text" maxlength="16" size="16" pattern="\d*"required></td>' +
		'</tr>' +
		'<tr>' +
		'<th>Card Expiry: </th>' +
		'<td><input type="text" maxlength="4" size="4" pattern="\d*" required></td>' +
		'</tr>' +
		'<tr>' +
		'<th>CVV: </th>' +
		'<td><input type="password" pattern="\d*" maxlength="3" size="3" required></td>' +
		'</tr>' +
	'</table>' +
	'<input type="button" class="shopBtn pull-right" value="Confirm and Pay!" onclick="confirmOrder()">' +
	'</div>';

	mylist.append(output);

}


/**
	* Called when user clicks "Confirm and Pay!" Button
	* Calls ConfirmOrderServlet, which adds entries in poitem table in DB, for the particular Poid
	*/
function confirmOrder() {
	var poid = localStorage.getItem("Poid");
	var cartArray = localStorage.getItem("Items_in_Cart");

	var mylist = $("#book_listId");
	mylist.empty();

	$.get("https://192.168.43.9:8443/OnlineBookStore/ConfirmOrderServlet",
	{
		Poid : poid,
		CartArray : cartArray
	},
	function(data) {
		var confirm_Order = data.ConfirmOrder;
		mylist.append('<div class="row">');
		if(confirm_Order === true) {
			mylist.append("<p><h3> Order Placed Successfully </h3></p>");
			mylist.append('<input type="button" class="shopBtn pull-right" value="Logout" onclick="Logout()">');
			mylist.append('<input type="button" class="shopBtn pull-left" value="Continue Shopping" onclick="ContinueShopping()">');
			mylist.append('</div>');
		}
		else {
			mylist.append("<p style='color:red'><h3>Credit Card Authorization Denied </h3></p>");
			mylist.append('<input type="button" class="shopBtn pull-right" value="Logout" onclick="Logout()">');
			mylist.append('<input type="button" class="shopBtn pull-left" value="Continue Shopping" onclick="ContinueShopping()">');
			mylist.append('</div>');
		}

	});

	mylist.append(output);
}

/**
	* Called when user clicks "Logout" Button
	* Clears the localStorage and the cart
	*/
function Logout() {
	shoppingCart.clearCart();
	localStorage.clear();
	$("#HiUser").empty();
	var mylist = $("#book_listId");
	mylist.empty();
	mylist.append("<div class='row span12'><p><h3> Logged Out Successfully </h3></p></div>");
	mylist.append('<input type="button" class="shopBtn pull-left" value="Continue Shopping" onclick="getList()"></div>');
}

/**
	* Called when the user clicks the "Continue Shopping" Button
	* Clears the cart before leading the user to the first page
	*/
function ContinueShopping() {
	shoppingCart.clearCart();
	getList();
}
