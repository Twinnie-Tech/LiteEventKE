const BrandMark = ({ size = 36 }: { size?: number }) => {
    return (
        <span className="brand-mark" style={{ width: size, height: size }} aria-hidden>
            <svg viewBox="0 0 32 32" fill="none">
                <path d="M4 24.5 11.2 12.2 16 18.4 20.4 9.5 28 24.5H4Z" fill="white" />
                <path d="M16 18.4 20.4 9.5 24.2 24.5H14.6L16 18.4Z" fill="white" fillOpacity="0.72" />
            </svg>
        </span>
    );
};

export default BrandMark;
