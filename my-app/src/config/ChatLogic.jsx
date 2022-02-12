export const getSender = (loggedUser, userList) => {
    return (userList[0]._id === loggedUser._id? userList[1].name:userList[0].name)
}

export const getSenderFull = (loggedUser, userList) => {
    return (userList[0]._id === loggedUser._id? userList[1]:userList[0].name)
}

