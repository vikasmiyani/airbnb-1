/**
 * Created by Divya Patel on 11/21/2016.
 */
var bcrypt = require('bcryptjs');
/*var fecha = require('fecha');*/
/*var mongo = require("./mongo");
 var config = require('./config.js');*/
var User = require('../model/user');
var mongoose = require('mongoose');
var Property = require('../model/property');
var Billing = require('../model/billing');
var Trip = require('../model/trip');
var ssn = require('ssn');

exports.editUser = function (msg, callback) {


    var firstName = msg.firstName;
    var lastName = msg.lastName;
    var email = msg.email;
    var address = msg.address;
    var state = msg.state;
    var city = msg.city;
    var zip = msg.zip;
    var userId = msg.userId;


    console.log('In edit user');

    User.update({_id: userId},
        {
            $set: {

                firstName: firstName,
                lastName: lastName,
                address: address,
                city: city,
                state: state,
                zip: zip,
                email: email

            }
        },

        function (err, user) {
            if (err) {

                console.log(err);
                callback(err, null);
            }
            else {

                callback(null, user);
            }
        });
};


exports.loadEditUserPage = function (msg, callback) {


    var userId = msg.userId;
    console.log('In edit user');

    User.findOne({_id: userId}, function (err, user) {
        if (err) {

            console.log(err);
            callback(err, null);
        }
        else {
            console.log("USER IS");
            console.log(user);
            callback(null, user);
        }
    });
};


exports.uploadProfileImage = function (msg, callback) {


    var userId = msg.userId;
    var fileName = msg.fileName;

    User.update({_id: userId},
        {
            $set: {
                profileImage: fileName
            }
        },

        function (err, user) {
            if (err) {

                console.log(err);
                callback(err, null);
            }
            else {

                callback(null, user);
            }
        });

};

exports.loadProfilePhotoPage = function (msg, callback) {

    var userId = msg.userId;

    User.findOne({_id: userId}, function (err, user) {
        if (err) {

            console.log(err);
            callback(err, null);
        }
        else {
            console.log("USER IS");
            console.log(user);
            callback(null, user);
        }
    });


};

exports.loadPaymentPage = function (msg, callback) {


    var userId = msg.userId;

    User.findOne({_id: userId}, function (err, user) {

        if (err) {

            console.log("Error occurred");
            console.log(err);
            callback(err, null);

        }
        else {

            console.log(user);
            callback(null, user);

        }

    });


};

exports.getPropertyDetails = function (msg, callback) {


    // var userId = msg.userId;
    var propertyId = msg.propertyId;

    Property.findOne({_id: propertyId}).populate('mediaId').populate("hostId").exec(function (err, result) {

        if (err) {

            console.log("ERROR TO GET PROPERTY DETAILS");
            console.log(err);
            callback(err, null);
        }
        else {

            console.log("property ");
            console.log(result);
            callback(null, result);

        }

    });


};

exports.confirmBooking = function (msg, callback) {


    var userId = msg.userId;
    var propertyId = msg.propertyId;
    var cardNumber = msg.cardNumber;
    var expMonth = msg.expMonth;
    var expYear = msg.expYear;
    var expDate = expMonth + "/" + expYear;
    var cvv = msg.cvv;
    var guest = msg.guest;
    var checkin = msg.checkin;
    var checkout = msg.checkout;
    var price = msg.price;
    var days = msg.days;
    var hostId = msg.hostId;


    User.update({_id: userId},
        {
            $set: {
                cardNumber: cardNumber,
                cvv: cvv,
                expDate: expDate

            }
        }, function (err, user) {

            if (err) {

                console.log("Error to save Credit card details");
                console.log(err);

            }
            else {

                console.log("Credit Card details saved");

            }


        });


    var trip = new Trip();
    trip.tripId = ssn.generate();
    trip.propertyId = propertyId;
    trip.userId = userId;
    trip.hostId = hostId;
    trip.checkIn = checkin;
    trip.checkOut = checkout;
    trip.noOfGuests = guest;
    trip.isAccepted = false;
    trip.createdDate = new Date().getTime();

    trip.save(function (err) {

        if (err) {

            console.log("ERROR TO SAVE TRIP");
            console.log(err);
            callback(err, null);

        }
        else {

            console.log("TRIP SAVED");
            callback(null, trip);
        }

    });


};