import _ from "lodash";

export const titleCase = str => {
  return _.map(str.split(' '), _.upperFirst).join(' ');
}
