const GetInTouchRow = (props: { icon: React.ReactNode; desc: JSX.Element }) => {
  const { icon, desc } = props;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontWeight: "bold",
        }}
      >
        <div
          style={{
            paddingRight: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {icon}
        </div>
        {desc}
      </div>
    </div>
  );
};

export default GetInTouchRow;
