import { useEffect, useRef } from 'react';

const ImageGridTestPage: React.FC = () => {
  const imageGridRef = useRef<HTMLDivElement>(null);

  const images = [
    '/assets/testImages/1735362964968-removebg-preview.png',
    '/assets/testImages/IMG_20240515_004422.jpg',
    '/assets/testImages/2785e4160c717d329d7770799f68ff3a.jpg',
    '/assets/images/logo/undraw_new-year-2025_1tmm.svg',
  ];

  useEffect(() => {
    const imageGrid = imageGridRef.current;
    if (!imageGrid) return;

    const numImages = imageGrid.children.length;
    const layoutClasses = ['single-image', 'two-images', 'three-images', 'four-images'];
    imageGrid.classList.remove(...layoutClasses);

    if (numImages === 1) {
      imageGrid.classList.add('single-image');
    } else if (numImages === 2) {
      imageGrid.classList.add('two-images');
    } else if (numImages === 3) {
      imageGrid.classList.add('three-images');
    } else if (numImages >= 4) {
      imageGrid.classList.add('four-images');
    }
  }, [images.length]);

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text
        bg-gradient-to-r from-purple-400 to-indigo-400">
        Image Grid Test
      </h1>

      {/* Facebook-style Post Grid */}
      <div
        className="facebook-post bg-white rounded-xl overflow-hidden shadow-lg"
        style={{ maxWidth: '350px', maxHeight: '350px', width: '100%' }}
      >
        <div
          ref={imageGridRef}
          id="imageGrid"
          className="image-grid"
          style={{ display: 'grid', gap: '2px' }}
        >
          {images.map((src, idx) => (
            <img
              key={idx}
              className="photo-post w-full h-full object-cover block border border-black"
              src={src}
              loading="lazy"
              alt={`Post image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Grid Layout Styles */}
      <style>{`
        .image-grid.single-image {
          grid-template-columns: 1fr;
        }
        .image-grid.two-images {
          grid-template-columns: 1fr 1fr;
          aspect-ratio: 1 / 1;
        }
        .image-grid.three-images {
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          aspect-ratio: 1 / 1;
        }
        .image-grid.three-images img:first-child {
          grid-column: 1 / -1;
          grid-row: 1 / -1;
        }
        .image-grid.four-images {
          grid-template-columns: 1fr 1fr;
          aspect-ratio: 1 / 1;
        }
        .image-grid img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

      {/* Controls */}
      <p className="text-gray-400 text-sm">
        Currently showing <span className="text-purple-400 font-bold">{images.length}</span> images
        in a <span className="text-purple-400 font-bold">
          {images.length === 1 ? 'single' : images.length === 2 ? 'two' : images.length === 3 ? 'three' : 'four'}-image
        </span> grid layout.
      </p>
    </div>
  );
};

export default ImageGridTestPage;
