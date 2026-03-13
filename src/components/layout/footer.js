export default function Footer() {
    return (
        <footer className="h-10 text-sm text-gray-500 flex items-center justify-center border-t">
            © {new Date().getFullYear()} POS System
        </footer>
    );
}
