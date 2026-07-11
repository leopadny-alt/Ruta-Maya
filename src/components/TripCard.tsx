type Props = {
  title: string;
  children: React.ReactNode;
};

function TripCard({ title, children }: Props) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.12)",
        borderRadius: 20,
        padding: 20,
        marginTop: 20,
      }}
    >
      <h2>{title}</h2>

      {children}
    </div>
  );
}

export default TripCard;