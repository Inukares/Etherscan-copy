## Problem

In order to display timestamp, from, to, address and value you have to get logs and blocks corresponding to those logs, as RPC connector doesn't include timestamp in logs details.

The real difficulty lies provider.getLogs function that returns unknown before request number of logs.
Possible scenarios are:
a) Too many logs ( throwing when response contains more than 10000 logs)
b) no logs at all
c) 0 < xLogs < 10000 (cap at which infura throws error response)

In order to solve this problem, one could:
1) Fetch latest block and tied to it transaction logs. If logs collected is less than desired, repeat the process starting from next block
2) Fetch logs from range of blocks. Iterate over those and fetch corresponding blocks. If logs collected is less than desired, repeat the process starting from next range.


## High level decisions
As 2) is much faster I chose to go this path. In fact, it is so fast that I had to artificially slow it with [Promise Queue](https://www.npmjs.com/package/p-queue) that helps avoiding getting rate limited.

I chose to simply show error when user loads more than 10000 logs and still allow user to search for transfers as it seemed user-friendly. Fetching functions could be easily customized to include custom pagination, so that different use cases would be covred.

I used `useLazyFetchTransfers` hook to take care of all the data handling, react-table-v7 for handling the sorting (as I wanted to save on time by implementing it by hand) and tailwind for the styling.


## Packages used
- tailwind for styling
- web3-react for useful hooks
- ethers for getting the blockchain data
- react-table-v7 for table sorting logic
- p-queue for avoiding getting rate limited
- jest for the unit tests
## Reflections about testing

In a real-world application I'd include tests for all the small utility functions. I'd also add E2E & component tests to get better confidence in each iteration.
I stumbled on issue with component tests while importing p-queue and I couldn't resolve it in a timely-fashion. I decided to focus on testing data-fetching.
Have I had more time to invest I would have added E2E and component test with Playwright. Here's an example of how I used it in a different assignment: [https://github.com/Inukares/Stakefish](https://github.com/Inukares/Stakefish)

## Thank you
Thank you for the opportunity to take part in this challenge and get to know ethereum blockchain more. I'm looking forward to hearing your feedback!

All the best,
Piotr



In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run test:debug`

Launches test runner in debug mode
