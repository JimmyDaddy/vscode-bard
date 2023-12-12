# <a href="https://bard.google.com/"><img src="/assets/bard.png" alt="Example Image" width="40" style="display: inline"></a>Google Bard (beta) vscode extension

[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/jimmydaddy.vscode-bard?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDx0aXRsZT5WaXN1YWwgU3R1ZGlvIENvZGU8L3RpdGxlPgogIDxwYXRoCiAgICBmaWxsPSIjMDA3QUNDIgogICAgZD0iTTIzLjE1IDIuNTg3TDE4LjIxLjIxYTEuNDk0IDEuNDk0IDAgMCAwLTEuNzA1LjI5bC05LjQ2IDguNjMtNC4xMi0zLjEyOGEuOTk5Ljk5OSAwIDAgMC0xLjI3Ni4wNTdMLjMyNyA3LjI2MUExIDEgMCAwIDAgLjMyNiA4Ljc0TDMuODk5IDEyIC4zMjYgMTUuMjZhMSAxIDAgMCAwIC4wMDEgMS40NzlMMS42NSAxNy45NGEuOTk5Ljk5OSAwIDAgMCAxLjI3Ni4wNTdsNC4xMi0zLjEyOCA5LjQ2IDguNjNhMS40OTIgMS40OTIgMCAwIDAgMS43MDQuMjlsNC45NDItMi4zNzdBMS41IDEuNSAwIDAgMCAyNCAyMC4wNlYzLjkzOWExLjUgMS41IDAgMCAwLS44NS0xLjM1MnptLTUuMTQ2IDE0Ljg2MUwxMC44MjYgMTJsNy4xNzgtNS40NDh2MTAuODk2eiIvPgo8L3N2Zz4%3D)](https://marketplace.visualstudio.com/items?itemName=jimmydaddy.vscode-bard)
[![Visual Studio Marketplace Version (including pre-releases)](https://img.shields.io/visual-studio-marketplace/v/jimmydaddy.vscode-bard?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDx0aXRsZT5WaXN1YWwgU3R1ZGlvIENvZGU8L3RpdGxlPgogIDxwYXRoCiAgICBmaWxsPSIjMDA3QUNDIgogICAgZD0iTTIzLjE1IDIuNTg3TDE4LjIxLjIxYTEuNDk0IDEuNDk0IDAgMCAwLTEuNzA1LjI5bC05LjQ2IDguNjMtNC4xMi0zLjEyOGEuOTk5Ljk5OSAwIDAgMC0xLjI3Ni4wNTdMLjMyNyA3LjI2MUExIDEgMCAwIDAgLjMyNiA4Ljc0TDMuODk5IDEyIC4zMjYgMTUuMjZhMSAxIDAgMCAwIC4wMDEgMS40NzlMMS42NSAxNy45NGEuOTk5Ljk5OSAwIDAgMCAxLjI3Ni4wNTdsNC4xMi0zLjEyOCA5LjQ2IDguNjNhMS40OTIgMS40OTIgMCAwIDAgMS43MDQuMjlsNC45NDItMi4zNzdBMS41IDEuNSAwIDAgMCAyNCAyMC4wNlYzLjkzOWExLjUgMS41IDAgMCAwLS44NS0xLjM1MnptLTUuMTQ2IDE0Ljg2MUwxMC44MjYgMTJsNy4xNzgtNS40NDh2MTAuODk2eiIvPgo8L3N2Zz4%3D)](https://marketplace.visualstudio.com/items?itemName=jimmydaddy.vscode-bard)

This is a vs code extension for [Google Bard(beta)](https://bard.google.com/).

> ***Google has not provided any open APIs for Bard, this extension is solely for entertainment and learning purposes.***

## Features

* Chat with [Google bard(beta)](https://bard.google.com/) in vscode
* Multiple answers for one question

  <p style='display:flex; align-items: flex-start'>
    <img src="./assets/sample.png" alt="Example Image" width="450" style="display: inline; margin-right: 8px">
    <img src="./assets/sample1.png" alt="Example Image" width="450" style="display: inline">
  </p>

## Extension Settings

* `vscode-bard.cookies`: Your Google Bard cookies.

## How to get cookies?

### Solution 1

* Go to <https://bard.google.com> and login.
* Open developer tools and go to `Application` tab.
* Click on `Cookies` and then `https://bard.google.com`.
* Search for `__Secure-1PSID` and copy the value.
* Paste the value `__Secure-1PSID={WHAT YOU COPIED}` in the extension settings `vscode-bard.cookies`.
* OR use shot cut `ctrl+shift+B` and paste the value.

  <img src="./assets/getcookie.png" alt="Example Image" width="450">

### Solution 2

* Go to <https://bard.google.com> and login.
* Open developer tools and go to network tab.
* Click on any request of the host `bard.google.com` and copy the value of `Cookie` header.
* Paste the value in the extension settings `vscode-bard.cookies`.
* OR use shot cut `ctrl+shift+B` and paste the value.

  <img src="./assets/getcookie2.png" alt="Example Image" width="450">

> **Note:**
>
> * ***Remember to close the opened bard webpage after getting the cookie.***
>
> * ***Due to Google's security policy, different regions may require different cookies. You can try setting all cookies starting with __Secure-1, or copy the entire cookie value as in Solution 2***.

**Enjoy!**
