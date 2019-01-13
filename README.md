# gatsby-source-gravatar

Plugin for Gravatar. IT IS A WORK IN PROGRESS and not published to npm yet.

## Install

`npm install gatsby-source-filesystem`

## How to use

```js
// In your gatsby-config.js
module.exports = {
	plugins: [
		{
			resolve: 'gatsby-source-gravatar',
			options: {
				profileName: 'jeremyamorin' // Your gravatar username
			},
		},
	]
```

## How to query

```graphql
query {
  gravatarProfile {
    hash
    requestHash
    profileUrl
    preferredUsername
    thumbnailUrl
    photos {
      value
      type
    }
    name {
      givenName
      familyName
    }
    displayName
    currentLocation
    accounts {
      domain
      display
      url
      userid
      verified
      shortname
    }
  }
}
```