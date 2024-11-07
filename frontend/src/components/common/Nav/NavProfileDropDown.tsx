// Constants
import RoutesList from "@/constants/Routes/RoutesList"

// Components
import Button from "@/components/common/Button"

// Icons
import { faGear, faShieldHalved, faComment, faUser } from "@fortawesome/free-solid-svg-icons"
import { useUser } from "@/store"

const NavProfileDropDown = () => {
    const { user } = useUser()

    return (
        <div className="p-2 group relative">
            <Button variant="default" size="default" className="rounded-full">
                {user?.username || "Undefined"}
            </Button>
            <ul className="absolute right-0 mt-2 bg-white w-52 rounded-lg overflow-hidden shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Button
                    variant="ghost"
                    icon={faUser}
                    to={`${RoutesList.profile.view(user?._id || "Undefined")}`}
                    className="w-full justify-start py-6"
                >
                    Profile
                </Button>
                <Button
                    variant="ghost"
                    icon={faShieldHalved}
                    to={`${RoutesList.settings.base}${RoutesList.settings.security}`}
                    className="w-full justify-start py-6"
                >
                    Security
                </Button>
                <Button
                    variant="ghost"
                    icon={faComment}
                    to={`${RoutesList.chat.base}`}
                    className="w-full justify-start py-6"
                >
                    Chat
                </Button>
                <Button
                    variant="ghost"
                    icon={faGear}
                    to={`${RoutesList.settings.base}`}
                    className="w-full justify-start py-6"
                >
                    Settings
                </Button>
            </ul>
        </div>
    )
}

export default NavProfileDropDown;