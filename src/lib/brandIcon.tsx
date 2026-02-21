import { brand } from "@/config/brand";

/** Shared branded icon element used by icon.tsx and apple-icon.tsx */
export function brandIcon({ borderRadius, fontSize }: { borderRadius: number; fontSize: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: `hsl(${brand.colors.light.primary})`,
        borderRadius,
        color: "white",
        fontSize,
        fontWeight: 700,
      }}
    >
      {brand.name.charAt(0).toUpperCase()}
    </div>
  );
}
