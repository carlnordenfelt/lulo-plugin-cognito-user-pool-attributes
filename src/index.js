'use strict';

var aws = require('aws-sdk');
var cognitoIdentityServiceProvider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
var _ = require('lodash');

var pub = {};

pub.schema = {
    CustomAttributes: {
        type: 'array',
        schema: {
            DeveloperOnlyAttribute: { type: 'boolean' },
            Mutable: { type: 'boolean' },
            Required: { type: 'boolean' }
        }
    }
};

pub.validate = function (event) {
    if (!event.ResourceProperties.UserPoolId) {
        throw new Error('Missing required property UserPoolId');
    }
    if (!event.ResourceProperties.CustomAttributes) {
        throw new Error('Missing required property CustomAttributes');
    }
    if (event.ResourceProperties.CustomAttributes.length === 0) {
        throw new Error('You must provide at least one CustomAttribute');
    }
};

pub.create = function (event, _context, callback) {
    delete event.ResourceProperties.ServiceToken;
    var params = event.ResourceProperties;
    cognitoIdentityServiceProvider.addCustomAttributes(params, function (error) {
        if (error) {
            return callback(error);
        }
        callback();
    });
};

pub.update = function (event, context, callback) {
    var newCustomAttributes = _.pullAllBy(
        event.ResourceProperties.CustomAttributes,
        event.OldResourceProperties.CustomAttributes,
        'Name');
    if (newCustomAttributes.length === 0) {
        return callback();
    }
    event.ResourceProperties.CustomAttributes = newCustomAttributes;
    pub.create(event, context, callback);
};

pub.delete = function (_event, _context, callback) {
    return setImmediate(callback);
};

module.exports = pub;
