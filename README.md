# lulo Cognito User Pool Attributes

lulo Cognito User Pool Attributes creates custom attributes for Amazon Cognito User Pools

lulo Cognito User Pools  Attributes is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-cognito-user-pool-attributes --save
```

## Usage
### Properties
* UserPoolId: User Pool Id. Required.
* CustomAttributes: Array of CustomAttributes. Required.

**Note: A CustomAttribute cannot be modified or deleted once created.**

### Return Values
None

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
   "Effect": "Allow",
   "Action": [
       "cognito-idp:AddCustomAttributes"
   ],
   "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
