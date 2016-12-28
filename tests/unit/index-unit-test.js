'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var addCustomAttributesStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            CognitoIdentityServiceProvider: function () {
                this.addCustomAttributes = addCustomAttributesStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        addCustomAttributesStub.reset().resetBehavior();
        addCustomAttributesStub.yields();
        event = {
            ResourceProperties: {
                UserPoolId: 'eu-west-1_EXAMPLE',
                CustomAttributes: [{ Name: 'Attribute1' }] 
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if UserPoolId is not set', function (done) {
            delete event.ResourceProperties.UserPoolId;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property UserPoolId/);
            done();
        });
        it('should fail if CustomAttributes is not set', function (done) {
            delete event.ResourceProperties.CustomAttributes;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property CustomAttributes/);
            done();
        });
        it('should fail if CustomAttributes length is 0', function (done) {
            event.ResourceProperties.CustomAttributes = [];
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/You must provide at least one CustomAttribute/);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(addCustomAttributesStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to addCustomAttributes error', function (done) {
            addCustomAttributesStub.yields('addCustomAttributes');
            subject.create(event, {}, function (error) {
                expect(error).to.equal('addCustomAttributes');
                expect(addCustomAttributesStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('update', function () {
        it('should do nothing if there are no new attributes', function (done) {
            event.OldResourceProperties = event.ResourceProperties;
            subject.update(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(addCustomAttributesStub.called).to.equal(false);
                done();
            });
        });
        it('should call addCustomAttribute if there is one new', function (done) {
            event.ResourceProperties.CustomAttributes.push({ Name: 'Attribute2' });
            event.OldResourceProperties = {
                CustomAttributes: [
                    { Name: 'Attribute1' }
                ]
            };
            subject.update(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(addCustomAttributesStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'eu-west-1_EXAMPLE';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(undefined);
                expect(addCustomAttributesStub.called).to.equal(false);
                done();
            });
        });
    });
});
