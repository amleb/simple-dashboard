import React from "react";
import { Button, Layout, Select } from "antd";
import { useRegion } from "../contexts/RegionContext";
import { useTheme } from "../contexts/ThemeContext";

const { Header } = Layout;

const regions = [
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "eu-central-1",
  "eu-west-1",
];

const IconSun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-sun"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <circle cx={12} cy={12} r={4} />
    <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
  </svg>
);

const IconMoonStars = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler icon-tabler-moon-stars"
    width={18}
    height={18}
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
    <path d="M19 11h2m-1 -1v2" />
  </svg>
);

export const TopBar: React.FC = (props) => {
  const { region, setRegion } = useRegion();
  const { theme, toggleTheme } = useTheme();

  const color = theme === "light" ? "#fff" : "#141414";

  return (
    <Header
      style={{
        background: color,
        padding: "0 16px",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: 8 }}>Region:</span>
      <Select
        style={{ width: 160 }}
        value={region}
        onChange={setRegion}
        options={regions.map((r) => ({ value: r, label: r }))}
      />
      <Button
        onClick={toggleTheme}
        icon={theme === "light" ? <IconMoonStars /> : <IconSun />}
      />
    </Header>
  );
};
