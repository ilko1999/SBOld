import {
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from 'solid-js';
import { client } from '../../App';
import { GET_ALL_LOCATIONS, GET_SPECIFIC_LOCATION } from '../../gql/events';
import { isEqual } from 'lodash';
import { createQuery } from 'solid-urql';

type EventLoc = {
  id: string;
  latitude: string;
  longitude: string;
  name: string;
};

function Drugo(props: any) {
  return <h1>Props: {props.geoJson}</h1>;
}

export default Drugo;
