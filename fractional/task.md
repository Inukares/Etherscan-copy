_NOTE: Please use Javascript or Typescript with exercises where it makes sense._

You will need a [Infura](https://infura.io) / [Alchemy](https://www.alchemy.com) account to connect to the Ethereum Node.
   You can use free-tier resources for this test.

## Basic

A) Please make improvements to the code below, using Javascript. If you are making any assumptions about how the code functions please make note of them.

```
connectToDatabase()
.then((database)  => {
    return getUser(database, 'email@email.com')
    .then(user => {
        return getUserSettings(database, user.id)
        .then(settings => {
            return setRole(database, user.id, "ADMIN")
            .then(success => {
                return notifyUser(user.id, "USER_ROLE_UPDATED")
                .then(success => {
                    return notifyAdmins("USER_ROLE_UPDATED")
                })
            })
        })
    })
})
```

## Practical

_Please use React JS / Next.js for the following task._

1. Create a React / Next application that interacts with the the [DAI smart contract](https://etherscan.io/address/0x6b175474e89094c44da98b954eedeac495271d0f) and has the following properties:
	- List last 100 DAI Transfers and include their etherscan link, timestamp, amount of DAI transferred, sender and recipient,
	- Update the list every time there is a new event,
	- Create two inputs. First allows filtering events by sender and the second by recipient. Same rules about first 100 DAI Transfers and updating the list apply.
	- Make the list sortable by event timestamp and value,

2. Use all React JS / Next.js best practices. Use state management library of your choice to store the results.

3. Use a web3 library such as ethers.js or web3.js to retrieve the results and listen to events.

4. (Bonus):
    - Use typescript,
    - Use tailwind for styling,
    - The app UX should be mobile friendly,
    - Write a couple of tests,
    
5. Write a high-level description (1 page) explaining your solution. Explanation should include: 
    - A description of what you've built
    - Which technologies you've used and how they tie together
    - Your reasons for high-level decisions 
   
## What We Review

Your application will be reviewed by at least two of our engineers. The aspects of your code we will judge include:
* **Clarity:** Does the README clearly explain the problem and solution?
* **Correctness:** Does the application do what was asked? If there is anything missing, does the README explain why it is missing?
* **Code Quality:** Is the code simple, easy to understand, and maintainable?
* **Testing:** how thorough are the automated tests? Will they be difficult to change if the requirements of the application were to change?
* **Technical Choices:** Do choices of libraries, databases, architecture seem appropriate for the challenge?

If anything above feels unclear, please use your own judgement to make assumptions. If you have a question about which coding language or framework you should be using on a particular task, please send an email to jasa@fractional.art or klemen@fractional.art to confirm.

Time limit: 7 days.

Send us your answers, as-well as the link to the Github repository back via email.

Please also make sure that the repository is private and that you give the following users access 
- TRCSamurai 
- jjfractional
- Cvetlicnifractional