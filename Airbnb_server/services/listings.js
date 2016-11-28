/**
 * Created by Salmaan on 11/22/2016.
 */

var Trip = require('../model/trip');
var Property = require('../model/property');
var Billing = require('../model/billing');
var mongoose = require('mongoose');
var ssn = require('ssn');

exports.getActiveListings = function (msg, callback) {

    var userId = msg.userId;

    var properties = {};
    properties.listed = [];
    properties.unlisted = [];
    properties.pending = [];


    Property
        .find({hostId: userId})
        .populate('hostId')
        .exec(function(err, results){
            if(err){
                console.log(err);
                callback(err, null);
            } else {

                for(result in results){

                    if(results[result].isApproved) {
                        if (results[result].isAvailable) {
                            properties.listed.push(results[result]);
                        } else {
                            properties.unlisted.push(results[result]);
                        }
                    } else {
                        properties.pending.push(results[result]);

                    }

                }

                callback(null, properties);
            }
        })



};

exports.addNewListing=function(msg,callback)
{
    console.log("Adding new Listing");
    var newListing=new Property();
    newListing.propertyId=ssn.generate();
    newListing.hostId=msg.hostId;
    newListing.maxGuest=msg.maxGuest;
   // newListing.roomType=msg.roomType;
    newListing.category=msg.category;
    newListing.city=msg.city;
    newListing.state=msg.state;
    newListing.address=msg.address;
    newListing.zip=msg.zipCode;
    newListing.bedrooms=msg.bedrooms;
   // newListing.beds=msg.beds;
    newListing.bathrooms=msg.bathrooms;
    newListing.name=msg.name;
    newListing.description=msg.description;
    newListing.price=msg.price;
    newListing.latitude=msg.latitude;
    newListing.longitude=msg.longitude;
    newListing.createdDate=msg.createdDate;
    newListing.isApproved=msg.isApproved;
    newListing.isBidding=msg.isBidding;
    newListing.isAvailable=true;
    if(msg.isBidding) {
        newListing.biddingDueTime = msg.createdDate / 1000 + (4 * 60);
        newListing.maxBidPrice=0;
    }
    newListing.save(function (err,result)
    {
        if(err)
        {
            console.log(err);
            callback(err,null);
        }
        else
        {
            console.log(result);
            var res={statusCode:200};
            callback(null,res);

        }
    });

}

exports.getReservations = function(msg, callback){

    var hostId = msg.hostId;


    var result = {};
    result.upcoming = [];
    result.unapproved = [];
    result.past = [];


    Trip
        .find({hostId: hostId})
        .populate('userId')
        .populate('propertyId')
        .populate('billingId')
        .exec(function(err, reservations){
            if(!err){

                for(i in reservations){

                    if(reservations[i].isAccepted){

                        if(reservations[i].checkIn > Date.now()){
                            result.upcoming.push(reservations[i]);
                        } else {
                            result.past.push(reservations[i]);
                        }

                    } else {
                        result.unapproved.push(reservations[i]);
                    }

                }

                console.log(result);
                callback(null, result);

            } else{
                console.log(err);
                callback(err, null);
            }
        })


};