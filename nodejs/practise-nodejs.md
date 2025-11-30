# Practise1
`npm init`

`npm i express` (or `npm install express`)

`npm i -save-dev babel cli`

`npm install eslint@5.2.0`

`npm outdated`

`npm remove eslint`

`npm install eslint`

#### A scoped module can be called as any npm module which has organization name or user name defined before @ in the package name.
#### It can either public or private.
#### To publish any module below is the command
`npm publish`

// above command is default command to publish private scoped npm package whereas, below is the command for public package
>> npm publish -access public
// command to verify the npm cache sanity
>> npm cache verify
// to clean the cache use below
>> npm cache clean
// to force clean
>> npm cache clean -force
// to identify issue with package and get report
>> npm audit
// fix the modules issues automatically
>> npm audit fix
// alternative to "npm run" is npx, i.e.
npx create-react-app@next sandbox
// above npx command to try out the next dist tag of create-react-app which will create the app inside a sandbox directory.


// alternative to npx is yarn
