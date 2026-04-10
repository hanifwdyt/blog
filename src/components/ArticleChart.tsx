"use client";

import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { ChartData } from "@/lib/api";

const ACCENT   = "#c4911e";
const MUTED    = "#5c5141";
const DIM      = "#3a3228";
const TEXT     = "#e4d9c2";
const BG_SOFT  = "#0d0b08";
const BORDER   = "#1a1710";

const PALETTE = [ACCENT, "#7a9e7e", "#6b8cba", "#b56a6a", MUTED, "#8c7aa8"];

const tooltipStyle = {
  backgroundColor: BG_SOFT,
  border: `1px solid ${BORDER}`,
  borderRadius: "4px",
  color: TEXT,
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "0.72rem",
  letterSpacing: "0.04em",
};

const axisStyle = {
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "0.62rem",
  fill: MUTED,
  letterSpacing: "0.04em",
};

interface Props {
  raw: string;
}

export default function ArticleChart({ raw }: Props) {
  let chart: ChartData;
  try {
    chart = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!chart?.data?.length) return null;

  const series = chart.series?.length
    ? chart.series
    : [{ key: "value", name: "Value", color: ACCENT }];

  const sharedProps = {
    data: chart.data,
    margin: { top: 8, right: 16, left: -8, bottom: 4 },
  };

  const gridEl = (
    <CartesianGrid strokeDasharray="3 3" stroke={DIM} vertical={false} />
  );
  const xEl = (
    <XAxis
      dataKey="name"
      tick={axisStyle}
      axisLine={{ stroke: DIM }}
      tickLine={false}
    />
  );
  const yEl = (
    <YAxis
      tick={axisStyle}
      axisLine={false}
      tickLine={false}
      width={40}
    />
  );
  const tooltipEl = (
    <Tooltip
      contentStyle={tooltipStyle}
      cursor={{ fill: "rgba(196,145,30,0.06)" }}
      itemStyle={{ color: TEXT }}
      labelStyle={{ color: MUTED, marginBottom: "4px" }}
    />
  );
  const legendEl = series.length > 1 ? (
    <Legend
      wrapperStyle={{
        fontFamily: "var(--font-mono, monospace)",
        fontSize: "0.62rem",
        color: MUTED,
        paddingTop: "12px",
      }}
    />
  ) : null;

  let chartEl: React.ReactNode;

  if (chart.type === "bar") {
    chartEl = (
      <BarChart {...sharedProps}>
        {gridEl}{xEl}{yEl}{tooltipEl}{legendEl}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.name}
            fill={s.color ?? PALETTE[i % PALETTE.length]}
            radius={[2, 2, 0, 0]}
            maxBarSize={52}
          />
        ))}
      </BarChart>
    );
  } else if (chart.type === "line") {
    chartEl = (
      <LineChart {...sharedProps}>
        {gridEl}{xEl}{yEl}{tooltipEl}{legendEl}
        {series.map((s, i) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.name}
            stroke={s.color ?? PALETTE[i % PALETTE.length]}
            strokeWidth={1.5}
            dot={{ r: 3, fill: s.color ?? PALETTE[i % PALETTE.length], strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    );
  } else if (chart.type === "area") {
    chartEl = (
      <AreaChart {...sharedProps}>
        {gridEl}{xEl}{yEl}{tooltipEl}{legendEl}
        {series.map((s, i) => {
          const color = s.color ?? PALETTE[i % PALETTE.length];
          return (
            <Area
              key={s.key}
              dataKey={s.key}
              name={s.name}
              stroke={color}
              fill={color}
              fillOpacity={0.08}
              strokeWidth={1.5}
            />
          );
        })}
      </AreaChart>
    );
  } else if (chart.type === "pie") {
    chartEl = (
      <PieChart>
        <Pie
          data={chart.data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={48}
          paddingAngle={2}
          strokeWidth={0}
        >
          {chart.data.map((_entry, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: TEXT }} />
        <Legend
          wrapperStyle={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.62rem",
            color: MUTED,
          }}
        />
      </PieChart>
    );
  } else {
    return null;
  }

  return (
    <div
      style={{
        margin: "3rem 0",
        padding: "2rem 1.75rem 1.5rem",
        background: BG_SOFT,
        border: `1px solid ${BORDER}`,
        borderRadius: "4px",
      }}
    >
      {/* Chart header */}
      {(chart.title || chart.description) && (
        <div style={{ marginBottom: "1.75rem" }}>
          {chart.title && (
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.05rem",
                fontWeight: 600,
                color: TEXT,
                letterSpacing: "-0.02em",
                marginBottom: chart.description ? "0.35rem" : 0,
              }}
            >
              {chart.title}
            </p>
          )}
          {chart.description && (
            <p
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.62rem",
                color: MUTED,
                letterSpacing: "0.06em",
              }}
            >
              {chart.description}
            </p>
          )}
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        {chartEl as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
