'use client';

interface ContainerProps {
    children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({
    children
}) => {
    return (
        <div
            style={{ backgroundColor: '#FFFFFF' }}
            className="
                max-w-[2520px]
                mx-auto
                xl:px-2
                md:px-10
                sm:px-2
                px-4
            "
        >
            {children}
        </div>
    );
}

export default Container;
