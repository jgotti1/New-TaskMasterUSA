import styled from "styled-components";
import { Link } from "react-router-dom";
import { mobile, tablet } from "../responsive";
import FooterSignature from "./FooterSignature";

const Container = styled.footer`
  margin-top: clamp(64px, 6vw, 112px);
  background-color: #1c1f22;
  color: white;

  ${mobile({ marginTop: "44px" })};
`;

const Wrapper = styled.div`
  max-width: 1712px;
  margin: 0 auto;
  padding: 26px 16px 18px 16px;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 24px;

  ${tablet({ gridTemplateColumns: "1fr 1fr" })};
  ${mobile({ gap: "18px", padding: "22px 22px 14px 22px" })};
`;

const Brand = styled.div`
  ${tablet({ gridColumn: "1 / -1" })};
`;

const Logo = styled.h2`
  margin: 0 0 4px 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const Desc = styled.p`
  margin: 0;
  max-width: 340px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.92rem;
  line-height: 1.45;
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  color: #48b9ea;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 18px;
`;

const ListItem = styled.li`
  a {
    color: rgba(255, 255, 255, 0.78);
    font-size: 0.95rem;
    text-decoration: none;
  }

  a:hover {
    color: white;
    text-decoration: underline;
  }
`;

const REPO_URL = "https://github.com/jgotti1/New-TaskMasterUSA";

const Footer = () => {
  return (
    <Container>
      <Wrapper>
        <Brand>
          <Logo>TaskMaster</Logo>
          <Desc>Take control of your workflow. Assign tasks, track progress and get more done as a team.</Desc>
        </Brand>
        <div>
          <Title>Explore</Title>
          <List>
            <ListItem>
              <Link to="/">Home</Link>
            </ListItem>
            <ListItem>
              <Link to="/signup">Sign up</Link>
            </ListItem>
            <ListItem>
              <Link to="/login">Log in</Link>
            </ListItem>
          </List>
        </div>
        <div>
          <Title>Project</Title>
          <List>
            <ListItem>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Source code
              </a>
            </ListItem>
            <ListItem>
              <a href="https://margotticode.com" target="_blank" rel="noopener noreferrer">
                More by John Margotti
              </a>
            </ListItem>
          </List>
        </div>
      </Wrapper>
      <FooterSignature repoUrl={REPO_URL} />
    </Container>
  );
};

export default Footer;
