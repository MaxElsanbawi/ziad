export default function CategoryCard({ imgUrl, text }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white h-[200px] px-16 flex justify-center items-center shadow-md rounded-4xl mb-4">
        <img className="w-[200px] " src={imgUrl} />
      </div>
      <h3>{text}</h3>
    </div>
  );
}
