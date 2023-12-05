const GET_ALL_EVENTS = `query Event($longitude: Float, $latitude: Float) {
  events(longitude: $longitude, latitude: $latitude) {
   
    Organization {
      email
      name
      profileName
      id
    }
    orgUserId   
    organizationId
    sportId  
    userId    
    maxPpl   
    isPaid   
    isOpen
    hasFinished
    id
    EventAdditions {
        description,
        eventCoverPhoto,
        nameOfTheEvent
      }
      sport {
        id
        name
      }
      createdBy {
        id
        name
        profileName
      }
      usersRequestingToJoin {
        id
      }
      User {
        id
        name
        profileName
        userPhoto
      }
    createdAt  
    numVisited
    }
}`;

const GET_ALL_SPORTS = `query Query {
  sports {
    id
    name
  }
}`;

const UPDATE_VIEWS_EVENT = `mutation Mutation($setVisitedEventId: String!) {
  setVisitedEvent(id: $setVisitedEventId) {
    numVisited
    id
  }
}`;

const GET_ALL_LOCATIONS = `query Query {
  locations {
    id
    latitude
    longitude
    name
  }
}`;

const GET_SPECIFIC_LOCATION = `query Query($locationId: String!) {
  location(locationId: $locationId) {
    id
    latitude
    longitude
    name
  }
}`;

const CREATE_EVENT = `mutation Mutation($createEventInput: CreateEventInput!, $clubId: String) {
  createEvent(createEventInput: $createEventInput, clubId: $clubId) {
    id
  }
}`;

const GET_CERTAIN_EVENT_ALL_DATA = `query Query($eventId: String!) {
  event(id: $eventId) {
    EventAdditions {
      description
      eventCoverPhoto
      nameOfTheEvent
    }
    Organization {
      email
      name
      profileName
      id
    }
    createdAt
    createdBy {
      id
      name
      profileName
    }
    date
    id
    isOpen
    isPaid
    location {
      id
      latitude
      longitude
      name
    }
    maxPpl
    sport {
      id
      name
    }
    time
    usersRequestingToJoin {
      id
      name
      email
      profileName
    }
    User {
      id
      name
      email
      profileName
    }
    numVisited
  }
}`;

const GET_ORG_EVENTS = `query Query {
  orgEvents {
    EventAdditions {
      description
      nameOfTheEvent
      eventCoverPhoto
    }
  }
}`;

const GET_MY_EVENTS = `query EventsUserParticipatesIn {
  eventsUserParticipatesIn {
    EventAdditions {
      description
      eventCoverPhoto
      nameOfTheEvent
    }
    id
  }
}`;

export {
  GET_ALL_EVENTS,
  GET_ALL_SPORTS,
  GET_ALL_LOCATIONS,
  GET_SPECIFIC_LOCATION,
  CREATE_EVENT,
  GET_CERTAIN_EVENT_ALL_DATA,
  UPDATE_VIEWS_EVENT,
  GET_ORG_EVENTS,
  GET_MY_EVENTS,
};
