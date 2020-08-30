# Expense Hub - Zero Backend Expense Tracker

This app used Ionic and Capacitor to enable an offline capable, zero backend PWA, iOS and Android App for taking pictures of receipts, entering amounts, calculating totals and tracking which expenses have been claimed. 

## Preview - PWA

You can view the PWA version of this app at [https://expensehub.netlify.app](https://expensehub.netlify.app/). This App can be added to the homescreen or installed as a PWA on your desktop. 

## Usage

1. clone repo

2. Ensure you have installed ionic cli and capacitor as per these [instructions](https://ionicframework.com/docs/intro/cli)  

3. run `npm install`

4. run `ionic serve` for dev server and live reloading.

## Limitations

This app is a proof of concept / MVP without any backend. It converts images to base64 strings which are stored in a local database using the [Capacitor Storage](https://capacitorjs.com/docs/apis/storage) which may present issues as the apps usage scales. In addition there are required methods to back this data up to ensure it is not lost. 

## Contributing

The initial work on this project was part of an academic submission, however PRs are welcome.
