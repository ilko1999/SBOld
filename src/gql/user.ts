const CREATE_SPORTBUDDY_USER = `
mutation CreateSportbuddy ($createSportbuddyInput : CreateSportbuddyInput! ) {
        createSportbuddy(createSportbuddyInput : $createSportbuddyInput) {
          refresh_token
          acces_token
        }
      }
`;

const GET_SPORTSBUDDY = `query Query {
  sportbuddy{
    id
    role
    email
    name
    profileName
    bio
    website
    igTag
    ytTag
    clubs {
      clubCoverPhoto
      name
      id
    }
    interests {
      name
      id
    }
    usersOrganization {
      id
      name
    }
  }
}
`;

const GET_USER_LOGIN_DATA = `
mutation LoginSportsBuddy($loginSportsBuddyInput: LoginSportsBuddyInput!) {
  loginSportsBuddy(loginSportsBuddyInput: $loginSportsBuddyInput) {
    refresh_token
    acces_token
  }
}`;

const GET_CERTAIN_BUDDY = `query Query($user: String!) {
  getUser(user: $user) {
    bio
    email
    id
    role
    igTag
    interests {
      id
      name
    }
    name
    organization {
      id
      profileName
    }
    profileName
    website
    ytTag
    socketId
    followedBy {
      name
      profileName
    }
    following {
      name
      profileName
    }
    Event {
      EventAdditions {
        description
        eventCoverPhoto
        nameOfTheEvent
      }
    }
  }
}`;

const GET_NEW_RT_ANT_AT = `mutation Mutation {
  rtSportsBuddy {
    acces_token
    refresh_token
  }
}`;

const GET_SEARCHED_INPUTS = `query Query($text: String!) {
  findBuddy(text: $text) {
    orgs {
      id
      name
      profileName
    }
    users {
      id
      name
      profileName
    }
  }
}`;

const GET_ORGANIZATION = `query Query($org: String!) {
  getOrg(org: $org) {
    bio
    email
    profileName
    Users {
      id
      name
    }
    orgCreatedEvent {
      id
      EventAdditions {
        eventCoverPhoto
        description
        nameOfTheEvent
      }
    }
    name
    id
  }
}`;

const GET_NOTIFS = `query Query {
  notifs {
    createdAt
    eventForUser {
      id
      EventAdditions {
        description
        nameOfTheEvent
      }
      sport {
        name
      }
    }
    id
    userAwaiting {
      name
      profileName
      userPhoto
    }
  }
}`;

const UPDATE_BUDDY = `mutation Mutation($updateSportbuddyInput: UpdateSportbuddyInput!) {
  updateSportbuddy(updateSportbuddyInput: $updateSportbuddyInput) {
    id
  }
}`;

const LOGOUT = `mutation Mutation {
  logoutSportsBuddy {
    id
  }
}`;

const GET_ALL_MESSAGES = `query Query($eventId: String!) {
  getMessagesOfEvent(eventId: $eventId) {
    createdAt
    sentBy {
      bio
      createdAt
      email
      eventId
      id
      isVerified
      name
      organizationId
      profileName
      role
      updatedAt
      userPhoto
    }
    text
  }
}`;

const VALIDATE_BUDDY = `query Query($user: String!) {
  getUser(user: $user) {
    name
    email
    profileName
  }
}`;

export {
  GET_USER_LOGIN_DATA,
  CREATE_SPORTBUDDY_USER,
  GET_SPORTSBUDDY,
  GET_NEW_RT_ANT_AT,
  GET_SEARCHED_INPUTS,
  GET_CERTAIN_BUDDY,
  GET_ORGANIZATION,
  GET_NOTIFS,
  UPDATE_BUDDY,
  LOGOUT,
  GET_ALL_MESSAGES,
  VALIDATE_BUDDY,
};
