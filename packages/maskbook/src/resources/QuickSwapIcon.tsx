import { SvgIconProps, SvgIcon } from '@material-ui/core'

const svg = (
    <svg viewBox="0 0 15 15">
        <path d="M452.28 64.136c-6.992 23.376-19.78 47.153-35.364 65.6-2.53 3.064-3.663 4.796-2.864 4.596.666-.2 4.662-1.398 8.991-2.73 4.263-1.332 7.926-2.398 8.192-2.398.733 0-1.399 3.064-7.126 10.19-11.589 14.319-23.11 24.908-37.296 34.432-7.193 4.862-19.914 11.655-26.24 14.053-2.531.999-2.798 1.398-4.53 6.327-3.662 10.323-8.191 17.848-14.984 25.041-2.331 2.531-4.063 4.529-3.863 4.529.999 0 14.785-6.127 23.177-10.256 10.256-5.195 19.78-10.856 28.571-17.183 6.26-4.462 5.794-4.396 18.648-2.531 50.683 7.26 98.968 29.97 139.06 65.468 7.926 6.993 24.11 23.643 24.11 24.708 0 .333.666 1.4 1.532 2.331 1.332 1.466 1.199 1.466-1.266-.333-1.531-1.065-6.793-4.995-11.655-8.658-10.522-7.992-25.241-17.715-35.897-23.71-8.658-4.928-21.312-11.388-21.312-10.855 0 .133 1.798 3.33 3.996 6.993 2.198 3.663 3.996 6.993 3.996 7.326 0 .4-2.331-.533-5.195-1.931-23.11-11.655-54.945-20.047-79.72-21.046l-7.992-.333 7.326 1.332c26.707 4.928 50.216 14.32 73.926 29.704 33.966 21.978 60.673 56.543 74.326 96.17 5.128 14.785 8.857 32.567 9.723 46.487.2 3.73.6 6.993.866 7.126 1.465.932 6.727-29.17 8.059-45.82.932-12.721.466-37.097-1-49.085-5.327-43.357-21.311-84.915-46.02-119.547-12.254-17.116-32.101-38.428-47.486-50.882-13.986-11.322-30.902-22.378-44.422-29.171-3.263-1.665-6.06-3.13-6.194-3.197-.133-.133.666-3.93 1.798-8.458 3.597-14.519 6.327-35.298 5.928-44.955l-.2-4.795-1.598 5.46z" />
        <path d="M317.416 91.242c-76.39 5.328-145.055 42.557-191.01 103.563-35.43 47.086-53.346 104.562-51.614 165.501.732 24.043 4.529 45.621 12.121 69.264 28.771 89.177 105.494 156.71 198.135 174.425 37.43 7.127 81.652 5.661 117.549-3.929 64.535-17.183 106.627-60.473 116.883-120.28 6.327-36.763-.733-77.788-19.38-112.687-23.244-43.623-60.94-75.324-108.159-91.042-22.444-7.46-41.292-10.323-68.198-10.323H308.69l6.327 3.53c11.788 6.527 20.313 12.92 27.972 20.846 5.261 5.46 11.788 13.986 11.189 14.585-.133.133-4.13-.733-8.858-1.931-9.524-2.465-23.443-5.062-36.297-6.86-12.121-1.665-48.285-1.665-59.607 0-25.84 3.863-46.953 10.789-67.133 21.845-7.126 3.929-20.846 12.92-21.578 14.119-.866 1.398-12.321 10.456-13.187 10.456-1.132 0-1.265-.333-2.997-9.857-1.399-7.392-1.598-8.058-2.597-7.26-19.181 16.451-41.426 35.099-41.958 35.099-1.133 0-.933-23.71.266-34.965 4.262-40.293 18.115-77.39 41.292-110.49 15.052-21.578 35.698-42.224 57.343-57.409 27.505-19.247 60.206-32.9 93.173-38.827 25.708-4.596 59.873-4.463 83.916.333 2.93.599 5.528 1.265 5.794 1.531.4.333-16.583 15.252-23.576 20.78l-1.399 1.065 1.399 5.328c.799 2.864 1.665 7.126 1.865 9.324l.466 4.13 5.927-3.997c12.255-8.258 24.243-17.982 36.03-29.237 7.26-6.926 18.649-19.447 18.982-20.912.4-1.665-27.573-9.524-43.823-12.321-18.981-3.197-43.024-4.53-60.206-3.397z" />
        <path d="M328.671 186.214c-3.463 2.93-18.981 10.589-29.637 14.652-20.912 7.858-28.771 14.185-29.77 23.976l-.4 3.596h3.463c1.865 0 6.327-.333 9.79-.733 21.113-2.33 35.032-11.122 43.69-27.639 2.464-4.662 6.127-14.585 5.728-15.584-.133-.333-1.399.466-2.864 1.732zm-146.853 84.848c-4.729 1.399-9.457 5.528-12.854 11.389-1.931 3.33-4.795 11.788-4.196 12.387.2.267.4-.066.4-.6 0-1.464 6.86-7.725 10.123-9.19 1.599-.733 4.263-1.332 5.994-1.332 2.664 0 3.33.266 4.729 2.065l1.598 2.064 1.066-3.93c.666-2.197 1.132-5.194 1.132-6.726 0-4.529-3.73-7.392-7.992-6.127z" />
    </svg>
)

export function QuickSwapIcon(props: SvgIconProps) {
    return <SvgIcon {...props}>{svg}</SvgIcon>
}
