# Sub-Address KEy (SAKE) app

Web application that can be used to generate new sub-addresses as defined in the [Sub-Address KEy (SAKE) filter](https://github.com/breard-r/opensmtpd-filter-sake).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```


## Frequently Asked Questions

## Can I use this app without self-hosting it?

Unfortunately, although it would be ok, there is currently no known hosted version of this application. This should change in the future.

## Can I use this app completely offline?

Currently, you only need the network connectivity to load the application. Once it's loaded, it can be used without access to the network.

In the future it may evolve in a [progressive web application](https://en.wikipedia.org/wiki/Progressive_web_app) so it can be installed and used completely offline.

## Where does this app stores my data?

Your data is exclusively stored in your browser's local storage. Nothing is sent over the network.

## I use multiple devices, how do I synchronize my data?

Currently, because it is stored exclusively locally, you cannot synchronize your data.

This is a deliberate choice. In the future there may be a way to export it, but not automatically and in no circumstances over the network.

## Do I have to write my secret-key by hand?

Not at all! If your key is represented by a QR code, you can scan it.

## How do I generate a QR code with my key?

From the command line you can use the [qrencode](https://fukuchi.org/works/qrencode/) tool. Most Linux distributions and BSD systems have this tool in their packages or ports.

You can generate a new secret key and display it both in a base64 string and a QR code using the following command:

```
secret_key="$(openssl rand -base64 16)" && echo "Secret key: ${secret_key}" && qrencode -t utf8 "${secret_key}" && unset secret_key
```
