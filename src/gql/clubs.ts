const CREATE_CLUB = `mutation Mutation($createClubInput: CreateClubInput!) {
    createClub(createClubInput: $createClubInput) {
      clubCoverPhoto
      name
      id
    }
  }`;

const GET_CLUB = `query Query($clubId: String!) {
    getClub(clubId: $clubId) {
      clubCoverPhoto
      desc
      name
      events {
        EventAdditions {
          description
          eventCoverPhoto
          nameOfTheEvent
        }
        id
      }
      organization {
        id
        name
        profileName
        email
      }
      users {
        email
        id
        name
        profileName
      }
    }
  }`;

const GET_CERTAIN_CLUBS = `query GetClubsByString($orgId: String!) {
    getClubsByString(orgId: $orgId) {
      id
      name
      clubCoverPhoto
      users {
        email
        id
        name
        profileName
      }
    }
  }`;

const JOIN_CLUB = `mutation Mutation($clubId: String!) {
    joinClub(clubId: $clubId) {
      id
    }
  }`;

export { CREATE_CLUB, GET_CLUB, GET_CERTAIN_CLUBS, JOIN_CLUB };
