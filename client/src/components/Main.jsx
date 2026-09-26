import styled from "styled-components";
import { Link } from "react-router-dom";
import { ArrowForward, AssignmentTurnedIn, FileDownload, Groups, Insights } from "@mui/icons-material";
import { mobile, tablet } from "../responsive";
import backgroundImg from "../images/backgroundTwo.jpg";

// Fills most of the screen on wide monitors (capped so ultra-wide screens stay readable)
const Page = styled.div`
  width: calc(100% - 32px);
  max-width: 1680px;
  margin: 0 auto;
  padding: 16px 0 0 0;
`;

// ---------- Hero ----------
const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: clamp(32px, 4vw, 80px);
  padding: clamp(40px, 5vw, 88px);
  border-radius: 28px;
  background-image: linear-gradient(135deg, #012a3b 0%, #014866 55%, #02698f 100%);

  ${tablet({ gridTemplateColumns: "1fr", padding: "40px 32px", gap: "36px" })};
  ${mobile({ padding: "32px 20px", borderRadius: "20px", gap: "28px" })};
`;

const PhotoFrame = styled.div`
  position: relative;
  min-height: clamp(400px, 34vw, 660px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);

  ${tablet({ minHeight: "380px" })};
  ${mobile({ minHeight: "280px" })};
`;

const Photo = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
`;

const PhotoBadge = styled.div`
  position: absolute;
  left: 16px;
  bottom: 16px;
  right: 16px;
  width: fit-content;
  max-width: calc(100% - 32px);
  padding: 10px 16px;
  border-radius: 12px;
  background-color: rgba(1, 40, 58, 0.82);
  backdrop-filter: blur(6px);
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
`;

const HeroContent = styled.div`
  max-width: 700px;
  color: white;
`;

const Eyebrow = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  background-color: rgba(72, 185, 234, 0.18);
  border: 1px solid rgba(72, 185, 234, 0.45);
  color: #bfe9fb;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`;

const Headline = styled.h1`
  margin: 20px 0 18px 0;
  font-size: clamp(2.3rem, 4.4vw, 4.8rem);
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const Lede = styled.p`
  margin: 0 0 32px 0;
  font-size: clamp(1.05rem, 1.35vw, 1.4rem);
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.88);

  ${mobile({ fontSize: "1rem" })};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;

  ${mobile({ flexDirection: "column" })};
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 26px;
  border-radius: 12px;
  background-color: #02a1e6;
  color: white;
  font-size: clamp(1.05rem, 1.15vw, 1.25rem);
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(2, 161, 230, 0.35);
  transition: transform 0.15s ease, background-color 0.15s ease;

  &:hover {
    background-color: #0290cd;
    color: white;
    transform: translateY(-2px);
  }

  ${mobile({ justifyContent: "center" })};
`;

const GhostButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 14px 26px;
  border-radius: 12px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  color: white;
  font-size: clamp(1.05rem, 1.15vw, 1.25rem);
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.14);
    color: white;
  }

  ${mobile({ justifyContent: "center" })};
`;

// ---------- Sections ----------
const Section = styled.section`
  margin-top: clamp(64px, 6vw, 112px);

  ${mobile({ marginTop: "52px" })};
`;

const SectionTitle = styled.h2`
  margin: 0 0 10px 0;
  text-align: center;
  color: #014866;
  font-size: clamp(1.7rem, 3vw, 2.9rem);
  font-weight: 700;
  letter-spacing: -0.01em;
`;

const SectionSub = styled.p`
  margin: 0 auto clamp(32px, 3vw, 56px) auto;
  max-width: 700px;
  text-align: center;
  color: #5b6b75;
  font-size: clamp(1.05rem, 1.2vw, 1.25rem);
  line-height: 1.55;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(20px, 2vw, 32px);
`;

const Card = styled.div`
  padding: clamp(24px, 2.2vw, 40px);
  background-color: white;
  border: 1px solid #e1ebf0;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(1, 72, 102, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(1, 72, 102, 0.12);
  }
`;

const IconWrap = styled.div`
  width: clamp(50px, 3.6vw, 64px);
  height: clamp(50px, 3.6vw, 64px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  border-radius: 14px;
  background-color: rgba(2, 161, 230, 0.12);
  color: #0290cd;
`;

const CardTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #1c2b33;
  font-size: clamp(1.15rem, 1.3vw, 1.4rem);
  font-weight: 700;
`;

const CardText = styled.p`
  margin: 0;
  color: #5b6b75;
  font-size: clamp(1rem, 1.1vw, 1.15rem);
  line-height: 1.55;
`;

const StepNumber = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  border-radius: 50%;
  background-color: #014866;
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
`;

const StepCard = styled(Card)`
  background-color: #f4f9fc;
  box-shadow: none;
`;

// ---------- Closing call to action ----------
const CtaBand = styled.section`
  margin-top: clamp(64px, 6vw, 112px);
  padding: clamp(56px, 6vw, 96px) 24px;
  border-radius: 28px;
  text-align: center;
  color: white;
  background-image: linear-gradient(135deg, #014866 0%, #02698f 100%);

  ${mobile({ marginTop: "52px", padding: "40px 20px", borderRadius: "20px" })};
`;

const CtaTitle = styled.h2`
  margin: 0 0 12px 0;
  font-size: clamp(1.6rem, 3vw, 2.8rem);
  font-weight: 700;
`;

const CtaText = styled.p`
  margin: 0 auto 28px auto;
  max-width: 620px;
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(1.05rem, 1.2vw, 1.25rem);
  line-height: 1.55;
`;

const features = [
  {
    icon: <AssignmentTurnedIn />,
    title: "Assign with clarity",
    text: "Give every task an owner, a due date and a priority so nothing slips through the cracks.",
  },
  {
    icon: <Insights />,
    title: "See progress instantly",
    text: "Overdue, in progress and completed work is sorted for you on the admin dashboard.",
  },
  {
    icon: <Groups />,
    title: "Simple for your team",
    text: "Team members see only their own tasks and check them off with a single click.",
  },
  {
    icon: <FileDownload />,
    title: "Export to Excel",
    text: "Download your users and tasks as spreadsheets whenever you need a report.",
  },
];

const steps = [
  { title: "Create your organization", text: "Sign up and become the admin of your own private workspace." },
  { title: "Add your team", text: "Invite people as users or admins with just a name, an email and a password." },
  { title: "Assign and track", text: "Hand out tasks, follow their progress and export the results." },
];

const Main = () => {
  return (
    <Page>
      <Hero>
        <HeroContent>
          <Eyebrow>Task management for teams</Eyebrow>
          <Headline>Assign it. Track it. Get it done.</Headline>
          <Lede>Manage workflow and assign tasks in realtime for a more efficient operation. Take control of your organization's task priorities and get more done.</Lede>
          <Actions>
            <PrimaryButton to="/signup">
              Sign up now <ArrowForward fontSize="small" />
            </PrimaryButton>
            <GhostButton to="/login">Log in</GhostButton>
          </Actions>
        </HeroContent>
        <PhotoFrame>
          <Photo src={backgroundImg} alt="A person buried under sticky notes, overwhelmed by tasks" />
          <PhotoBadge>Goodbye, sticky notes. Hello, TaskMaster.</PhotoBadge>
        </PhotoFrame>
      </Hero>

      <Section>
        <SectionTitle>Everything your team needs</SectionTitle>
        <SectionSub>One place to hand out work, follow it through and keep everyone on the same page.</SectionSub>
        <Grid>
          {features.map((feature) => (
            <Card key={feature.title}>
              <IconWrap>{feature.icon}</IconWrap>
              <CardTitle>{feature.title}</CardTitle>
              <CardText>{feature.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Up and running in minutes</SectionTitle>
        <SectionSub>No setup, no installs. Three steps and your team is working.</SectionSub>
        <Grid>
          {steps.map((step, index) => (
            <StepCard key={step.title}>
              <StepNumber>{index + 1}</StepNumber>
              <CardTitle>{step.title}</CardTitle>
              <CardText>{step.text}</CardText>
            </StepCard>
          ))}
        </Grid>
      </Section>

      <CtaBand>
        <CtaTitle>Ready to take control?</CtaTitle>
        <CtaText>Create your organization and start assigning tasks today.</CtaText>
        <PrimaryButton to="/signup" style={{ display: "inline-flex" }}>
          Get started <ArrowForward fontSize="small" />
        </PrimaryButton>
      </CtaBand>
    </Page>
  );
};

export default Main;
