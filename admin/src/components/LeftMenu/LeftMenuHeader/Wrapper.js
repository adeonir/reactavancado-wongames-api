import styled from "styled-components";
import PropTypes from "prop-types";

import Logo from "../../../assets/images/logo-won.svg";

const Wrapper = styled.div`
  background-color: #007eff;
  padding-left: 2rem;
  height: ${(props) => props.theme.main.sizes.leftMenu.height};

  .projectName {
    display: block;
    width: 100%;
    height: ${(props) => props.theme.main.sizes.leftMenu.height};

    background-image: url(${Logo});
    background-repeat: no-repeat;
    background-position: left center;
    background-size: 12rem;
  }
`;

Wrapper.defaultProps = {
  theme: {
    main: {
      colors: {
        leftMenu: {},
      },
      sizes: {
        header: {},
        leftMenu: {},
      },
    },
  },
};

Wrapper.propTypes = {
  theme: PropTypes.object,
};

export default Wrapper;
