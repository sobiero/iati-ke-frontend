import _ from 'lodash';

export const titleCase = str => _.map(str.split(' '), _.upperFirst).join(' ');
