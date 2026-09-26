import styled from "styled-components";
import { GitHub } from "@mui/icons-material";
import { mobile } from "../responsive";

const Container = styled.div`
  padding: 14px 16px 16px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);

  ${mobile({ fontSize: "0.8rem" })};
`;

const Credit = styled.p`
  margin: 0 0 6px 0;
  line-height: 1.45;

  b {
    color: rgba(255, 255, 255, 0.85);
    font-weight: 500;
  }
`;

const Copyright = styled.p`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 10px;
`;

const Link = styled.a`
  color: #48b9ea;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    color: #7fd0f3;
    text-decoration: underline;
  }
`;

const IconLink = styled.a`
  display: inline-flex;
  color: rgba(255, 255, 255, 0.6);

  &:hover {
    color: white;
  }
`;

const FooterSignature = ({ repoUrl }) => {
  return (
    <Container>
      <Credit>
        Originally created as a bootcamp final project by <b>David Wendt, John Margotti, Jonathan Shinault</b> and <b>Patrick Bowes</b>.
      </Credit>
      <Copyright>
        <span>&copy; {new Date().getFullYear()} TaskMaster. Revamped in 2026 by</span>
        <Link href="https://margotticode.com" target="_blank" rel="noopener noreferrer">
          margotticode.com
        </Link>
        <IconLink href={repoUrl} target="_blank" rel="noopener noreferrer" aria-label="TaskMaster on GitHub">
          <GitHub fontSize="small" />
        </IconLink>
      </Copyright>
    </Container>
  );
};

export default FooterSignature;
