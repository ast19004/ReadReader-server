# ReadReader

## Table of contents

- [Description](#description)
- [Functionality](#functionality)
- [Technologies](#technologies)

- ![ReadReader Masonry wh 1readreader](https://github.com/ast19004/ReadReader/assets/84036167/6dda6ced-272e-41f2-81fa-1b63e0649ba2)

# Description

This application is meant to help guardians to gauge the reading of the elementary aged children they care for. Children are incentivized to read by the points they get per minute read. The main user/ guardian can add child-specific prizes to encourage the child to read. The guardian has the ability to add a point value on each prize.

# Functionality

Server-side registration & authentification of users.\
<br />
CRUD functionality for reader, reading sessions, and prizes.\
<br/>
MongoDB stores user credentials and associated readers & user created prizes.
Each reader has a list of reading sessions, a list of prizes assigned to them by their guardians, a list of prizes they have earned, and a sum of earned tokens.
\
<br />

# Technologies

Node.js, Express, MongoDB
