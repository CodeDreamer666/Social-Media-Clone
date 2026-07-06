import Image from "next/image";

type PostImageProps = {
    imageUrl: string;
    alt?: string;
};

export default function PostImage({
    imageUrl,
    alt = "Post image"
}: PostImageProps) {
    return (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/[0.06] bg-black/30">
            <Image
                src={imageUrl}
                alt={alt}
                width={1200}
                height={900}
                className="max-h-[520px] w-full object-contain"
            />
        </div>
    );
}
