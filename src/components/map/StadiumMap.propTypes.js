import PropTypes from 'prop-types';

export const stadiumMapPropTypes = {
  occupancyData: PropTypes.object,
  selectedZone: PropTypes.string,
  onZoneClick: PropTypes.func,
  showRoute: PropTypes.bool,
  routeFrom: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  routeTo: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
  showAccessible: PropTypes.bool,
  compact: PropTypes.bool,
};