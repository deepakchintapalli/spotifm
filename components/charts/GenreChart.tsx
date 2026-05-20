"use client";

import { GenreStats } from "@/types";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  genres: GenreStats[];
}

const CustomContent = (props: any) => {
  const { x, y, width, height, name, value, fill } = props;
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
      <rect x={x} y={y} width={width} height={height} fill="none" rx={4} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
      {width > 60 && height > 30 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="white" fontSize={Math.min(13, width / 7)} fontWeight="600" fontFamily="DM Sans, sans-serif">
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize={Math.min(11, width / 8)}>
            {value}%
          </text>
        </>
      )}
    </g>
  );
};

export function GenreChart({ genres }: Props) {
  const data = genres.slice(0, 15).map(g => ({
    name: g.name,
    value: g.percentage,
    fill: g.color,
  }));

  return (
    <ResponsiveContainer width="100%" height={340}>
      <Treemap
        data={data}
        dataKey="value"
        content={<CustomContent />}
        animationDuration={600}
      >
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="glass-card rounded-xl px-3 py-2 text-sm">
                <div className="font-semibold capitalize">{d.name}</div>
                <div style={{ color: d.fill }}>{d.value}%</div>
              </div>
            );
          }}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
