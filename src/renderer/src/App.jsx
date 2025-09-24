// src/renderer/src/App.jsx

import { useState, useEffect, useRef } from 'react';
import './assets/main.css';
import { auth } from './firebase';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInAnonymously,
	onAuthStateChanged,
	signOut,
	sendPasswordResetEmail,
	sendEmailVerification,
	getIdToken,
} from 'firebase/auth';
import {
	Home,
	Settings,
	User,
	RefreshCw,
	Trash2,
	KeyRound,
	LogIn,
	Check,
	ShieldCheck,
	Star,
	LogOut,
	Newspaper,
	ArrowLeft,
	Download,
	Loader,
	XCircle,
	FolderCog,
	Package,
	X,
	Info,
	CheckCircle,
	Mail,
	AlertTriangle,
	Upload,
	Lock,
	FileDown,
	FolderSearch,
	Search,
	FolderOpen,
} from 'lucide-react';

import wemodIcon from '../../../resources/wemod.ico';
import steamIcon from '../../../resources/steam.ico';
import forzaIcon from '../../../resources/forza horizon 5.ico';
import valorantIcon from '../../../resources/Valo.ico';
import gtaIcon from '../../../resources/gta 5.ico';

// =============================================================================
// 👇 Using the LOCAL worker for development
// =============================================================================
const workerUrl = 'CLOUDFLARE WORKER LINK HERE';
// =============================================================================

const iconMap = {
	'wemod.ico': wemodIcon,
	'steam.ico': steamIcon,
	'forza horizon 5.ico': forzaIcon,
	'Valo.ico': valorantIcon,
	'gta 5.ico': gtaIcon,
};

// =============================================================================
// Helper Components
// =============================================================================
const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <span className="progress-text">{progress}%</span>
    </div>
  );
};

const Notification = ({ message, type, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000); // Notifications last for 5 seconds

      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
      <span>{message}</span>
    </div>
  );
};

const ConfirmationModal = ({ show, onClose, onConfirm, title, children, isProcessing }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </header>
        <div className="modal-body">
          <p>{children}</p>
          <div className="modal-actions">
            <button className="settings-button" onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
            <button className="settings-button-danger" onClick={onConfirm} disabled={isProcessing}>
              {isProcessing ? <Loader size={16} className="spinner" /> : <Trash2 size={16} />}
              {isProcessing ? 'Removing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = ({ showNotification }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSigningUp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        showNotification('Account created! A verification email has been sent.', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="sidebar-title">
          <svg className="logo-icon" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <h1>Laundromod</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={18} className="input-icon" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="input-group">
            <KeyRound size={18} className="input-icon" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button type="submit" className="login-button">
            {isSigningUp ? 'Sign Up' : 'Login'}
          </button>
          <div className="divider">
            <span>OR</span>
          </div>
          <button type="button" className="guest-button" onClick={handleGuestLogin}>
            <LogIn size={16} />
            Continue as Guest
          </button>
          <button
            type="button"
            className="toggle-auth-button"
            onClick={() => setIsSigningUp(!isSigningUp)}
          >
            {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

const TitleBar = ({ onToggle, showToggle = true }) => {
  const handleMinimize = () => window.api.minimizeWindow();
  const handleClose = () => window.api.closeWindow();

  return (
    <div className="title-bar">
      <div className="title-bar-buttons">
        <button onClick={handleClose} className="title-bar-button red">
          <svg className="icon" viewBox="0 0 12 12">
            <path d="M2 2 L10 10 M10 2 L2 10" strokeWidth="1.5" />
          </svg>
        </button>
        <button onClick={handleMinimize} className="title-bar-button yellow">
          <svg className="icon" viewBox="0 0 12 12">
            <path d="M2 6 L10 6" strokeWidth="1.5" />
          </svg>
        </button>
        <button
          onClick={onToggle}
          className={`title-bar-button green ${showToggle ? 'visible' : ''}`}
        >
          <svg className="icon" viewBox="0 0 12 12">
            <path d="M3 9 L9 3 M3 3 L9 9" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// ... (imports and other components remain the same)

const PatchNotesPage = ({ onBack }) => {
  return (
    <div className="patch-notes-page">
      <header className="patch-notes-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h2>Patch Notes - v1.0.0</h2>
      </header>
      <div className="patch-notes-content">
        <h3>Welcome to the Official Launch of Laundromod!</h3>
        <p>
          This is our foundational release, built to be a simple, secure, and powerful tool for the
          modding community. Thank you for being here for version 1.0.0!
        </p>

        <div className="discord-cta">
            <p>
                <b>Want premium features?</b>{' '}
                <a href="https://discord.gg/weJ7be7xpv" target="_blank" rel="noopener noreferrer">
                    Join the Discord to get access to Premium!
                </a>
            </p>
        </div>

        <h3>Premium Features</h3>
        <ul>
          <li>
            <b>Steam Games Pack:</b> Get access to over 1300 Steam games pack + 128 instant unlock steam games.
          </li>
          <li>
            <b>WeMod Premium Unlock:</b> A guided, multi-step installer is now available to help you
            patch the WeMod desktop app for premium features.
          </li>
        </ul>

        <h3>What's New in This Version</h3>
        <ul>
          <li>
            <b>Steam Custom Script Support:</b> The Steam mod now automatically creates the{' '}
            <code>config/stplugin</code> folder, allowing you to easily add your own custom Lua
            scripts.
          </li>
          <li>
            <b>User Accounts:</b> You can now create an account to save your settings and license
            information. Guest access is also available for quick use.
          </li>
            <li>
            <b>Generic File Downloader:</b> We can now add direct download links for other tools and
            files right on the home screen for your convenience.
          </li>
        </ul>
      </div>
    </div>
  );
};

// ... (The rest of your App.jsx file remains the same)

const SteamSettingsModal = ({ show, onClose, licenseStatus, showNotification }) => {
	const [steamPath, setSteamPath] = useState(null)

	useEffect(() => {
		if (show) {
			const fetchSteamPath = async () => {
				const path = await window.api.getSteamPath()
				setSteamPath(path)
			}
			fetchSteamPath()
		}
	}, [show])

	const handleChangeSteamPath = async () => {
		const newPath = await window.api.selectSteamPath()
		if (newPath) {
			setSteamPath(newPath)
		}
	}

	const handleOpenPluginFolder = async () => {
		const result = await window.api.openStplugInFolder()
		if (!result.success) {
			showNotification(result.message, 'error')
		}
	}

	const handleClaimSteamPack = () => {
		showNotification('Steam Pack download is not yet implemented.', 'info')
	}

	const isPremium = licenseStatus.status === 'licensed'

	if (!show) {
		return null
	}

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<header className="modal-header">
					<h3>Steam Settings</h3>
					<button className="close-button" onClick={onClose}>
						<X size={20} />
					</button>
				</header>
				<div className="modal-body">
					<div className="settings-item">
						<div className="settings-text">
							<h4>Change Steam Location</h4>
							<p className="path-display">{steamPath || 'Path not set'}</p>
						</div>
						<button className="settings-button" onClick={handleChangeSteamPath}>
							<FolderCog size={16} />
							Change
						</button>
					</div>
					<div className="settings-item">
						<div className="settings-text">
							<h4>Upload .Lua Files</h4>
							<p>Open the plugin folder to add your custom scripts.</p>
						</div>
						<button className="settings-button" onClick={handleOpenPluginFolder}>
							<Upload size={16} />
							Open Folder
						</button>
					</div>
					<div
						className="settings-item"
						data-tooltip={!isPremium ? 'Unlock premium to get this' : null}
					>
						<div className="settings-text">
							<h4>128 Steam Games Pack</h4>
							<p>Included with your license. Adds a collection of popular games.</p>
						</div>
						<button
							className="settings-button"
							onClick={handleClaimSteamPack}
							disabled={!isPremium}
						>
							{isPremium ? <Package size={16} /> : <Lock size={16} />}
							Claim
						</button>
					</div>
				</div>
			</div>
		</div>
	)
};

const WeModInstallModal = ({ show, onClose, mod, showNotification }) => {
	const [selectedPath, setSelectedPath] = useState(null)
	const [isScanning, setIsScanning] = useState(false)
	const [scanResult, setScanResult] = useState({ status: 'idle', message: '' })
	const [userConfirmedDelete, setUserConfirmedDelete] = useState(false)
	const [isPatching, setIsPatching] = useState(false)

	const handleDownloadInstaller = () => {
		window.open(mod.downloadUrl, '_blank')
	}

	const handleSelectPath = async () => {
		const path = await window.api.selectWeModPath()
		if (path) {
			setSelectedPath(path)
			setScanResult({ status: 'idle', message: `Folder selected. Ready to scan.` })
			setUserConfirmedDelete(false)
		}
	}

	const handleScan = async () => {
		if (!selectedPath) {
			showNotification('Please select the WeMod folder first.', 'error')
			return
		}
		setIsScanning(true)
		setScanResult({ status: 'scanning', message: 'Scanning for app.asar...' })
		const result = await window.api.scanForWeModAsar(selectedPath)
		if (result.success) {
			setScanResult({ status: 'success', message: result.message, path: result.path })
		} else {
			setScanResult({ status: 'error', message: result.message })
		}
		setIsScanning(false)
	}

	const handleOpenFolder = () => {
		if (scanResult.path) {
			window.api.openContainingFolder(scanResult.path)
		}
	}

	const handlePatch = async () => {
		if (!userConfirmedDelete) {
			showNotification('Please confirm you have deleted the file.', 'error')
			return
		}
		setIsPatching(true)
		const result = await window.api.installWeModMod({
			asarUrl: mod.asarUrl,
			exactAsarPath: scanResult.path
		})
		if (result.success) {
			showNotification('WeMod has been successfully patched!', 'success')
			onClose()
		} else {
			showNotification(`Patching failed: ${result.message}`, 'error')
		}
		setIsPatching(false)
	}

	useEffect(() => {
		if (scanResult.status === 'success' && scanResult.message.includes('already been deleted')) {
			setUserConfirmedDelete(true)
		}
	}, [scanResult])

	if (!show) return null

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<header className="modal-header">
					<h3>WeMod Premium Installation</h3>
					<button className="close-button" onClick={onClose}>
						<X size={20} />
					</button>
				</header>
				<div className="modal-body">
					<div className="installation-step">
						<div className="step-number">1</div>
						<div className="step-content">
							<h4>Download & Install WeMod v8.2.0</h4>
							<p>
								If you don't have it, download and run the official installer. Close WeMod
								completely after installation.
							</p>
							<button className="settings-button" onClick={handleDownloadInstaller}>
								<FileDown size={16} />
								Download Installer
							</button>
						</div>
					</div>

					<div className="installation-step">
						<div className="step-number">2</div>
						<div className="step-content">
							<h4>Scan for WeMod Installation</h4>
							<p>Select the main WeMod installation folder, then click Scan.</p>
							<div className="button-group">
								<button className="settings-button" onClick={handleSelectPath}>
									<FolderSearch size={16} />
									Select Folder
								</button>
								<button
									className="settings-button"
									onClick={handleScan}
									disabled={!selectedPath || isScanning}
								>
									{isScanning ? <Loader size={16} className="spinner" /> : <Search size={16} />}
									{isScanning ? 'Scanning...' : 'Scan for app.asar'}
								</button>
							</div>
							<div className={`scan-result-box status-${scanResult.status}`}>
								{scanResult.message || 'Scan results will appear here.'}
							</div>
						</div>
					</div>

					{scanResult.status === 'success' && (
						<>
							<div className="installation-step">
								<div className="step-number">3</div>
								<div className="step-content">
									<h4>Manually Delete `app.asar`</h4>
									<p>
										If the file exists, click the button below to open the folder, then manually
										delete the `app.asar` file.
									</p>
									<button
										className="settings-button"
										onClick={handleOpenFolder}
										disabled={scanResult.message.includes('already been deleted')}
									>
										<FolderOpen size={16} />
										Open Containing Folder
									</button>
									<div className="confirmation-checkbox">
										<input
											type="checkbox"
											id="delete-confirm"
											checked={userConfirmedDelete}
											onChange={(e) => setUserConfirmedDelete(e.target.checked)}
										/>
										<label htmlFor="delete-confirm">
											I have deleted the `app.asar` file (or it was already gone).
										</label>
									</div>
								</div>
							</div>

							<div className="installation-step">
								<div className="step-number">4</div>
								<div className="step-content">
									<h4>Install Patch</h4>
									<p>
										Once you have deleted the file and checked the box above, click here to install
										the patch.
									</p>
									<button
										className="settings-button-confirm"
										onClick={handlePatch}
										disabled={!userConfirmedDelete || isPatching}
									>
										{isPatching ? (
											<Loader size={16} className="spinner" />
										) : (
											<Download size={16} />
										)}
										{isPatching ? 'Patching...' : 'Install Patch'}
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	)
};

const AppTile = ({ app, index, status, isProcessing, onInstall, onConfigure }) => {
	const tileRef = useRef(null)

	const handleMouseMove = (e) => {
		const { left, top, width, height } = tileRef.current.getBoundingClientRect()
		const x = ((e.clientX - left) / width - 0.5) * 30
		const y = ((e.clientY - top) / height - 0.5) * 30
		tileRef.current.style.setProperty('--x', `${y * -1}deg`) // Flipped for more intuitive rotation
		tileRef.current.style.setProperty('--y', `${x}deg`)
	}

	const handleMouseLeave = () => {
		tileRef.current.style.setProperty('--x', '0deg')
		tileRef.current.style.setProperty('--y', '0deg')
	}

	const iconSrc = app.icon && iconMap[app.icon] ? iconMap[app.icon] : null
	const hasConfigure = app.id === 'steam' || app.id === 'wemod'

	const glowColor =
		app.id === 'steam'
			? 'rgba(0, 168, 255, 0.4)'
			: app.id === 'wemod'
				? 'rgba(162, 89, 255, 0.4)'
				: 'rgba(255, 255, 255, 0.2)'

	const renderButtonContent = (mod, status) => {
		const baseText = mod.id === 'wemod' ? 'Install Premium' : 'Install Mod'
		switch (status?.status) {
			case 'pending':
			case 'installing':
				return (
					<>
						<Loader size={16} className="spinner" /> Installing...
					</>
				)
			case 'downloading':
				return <ProgressBar progress={status.progress} />
			case 'complete':
				return (
					<>
						<Check size={16} /> Installed
					</>
				)
			case 'failed':
				return (
					<>
						<XCircle size={16} /> Failed
					</>
				)
			default:
				return (
					<>
						<Download size={16} /> {baseText}
					</>
				)
		}
	}

	return (
		<div
			ref={tileRef}
			className={`app-tile ${app.disabled ? 'disabled' : ''}`}
			style={{ animationDelay: `${index * 75}ms`, '--dynamic-glow-color': glowColor }}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{!app.disabled && (
				<button className="info-button">
					<Info size={16} />
				</button>
			)}
			<div className="app-icon">
				{iconSrc && <img src={iconSrc} alt={`${app.name} icon`} className="app-icon-img" />}
			</div>
			<div className="app-name">{app.name}</div>
			{app.disabled && <div className="coming-soon-badge">Coming Soon</div>}

			{!app.disabled &&
				(hasConfigure ? (
					<div className="app-action-group">
						<button className="install-button configure-button" onClick={() => onConfigure(app)}>
							<Settings size={16} />
							<span>Configure</span>
						</button>
						<button
							className={`install-button status-${status?.status || 'idle'}`}
							onClick={() => onInstall(app)}
							disabled={isProcessing}
						>
							{renderButtonContent(app, status)}
						</button>
					</div>
				) : (
					<div className="app-action">
						<button
							className={`install-button status-${status?.status || 'idle'}`}
							onClick={() => onInstall(app)}
							disabled={isProcessing}
						>
							{renderButtonContent(app, status)}
						</button>
					</div>
				))}
		</div>
	)
};


const AppGrid = ({ onShowPatchNotes, licenseStatus, appsConfig, showNotification }) => {
	const [installStatuses, setInstallStatuses] = useState({});
	const [isSteamModalOpen, setSteamModalOpen] = useState(false);
	const [isWeModModalOpen, setWeModModalOpen] = useState(false);
	const [selectedMod, setSelectedMod] = useState(null);

	useEffect(() => {
		const cleanupListener = window.api.onInstallStatusUpdate((update) => {
			setInstallStatuses((prev) => ({
				...prev,
				[update.downloadUrl]: { status: update.status, progress: update.progress },
			}));
		});

		return cleanupListener;
	}, []);

	const handleInstallMod = async (mod) => {
		if (mod.disabled) return;

		if (mod.id === 'wemod') {
			handleConfigure(mod);
			return;
		}

		let modToInstall = { ...mod };

		if (mod.id === 'steam') {
			const steamPath = await window.api.getSteamPath();
			if (!steamPath || steamPath.trim() === '') {
				showNotification('Please configure your Steam path in the Steam settings first.', 'error');
				return;
			}
			modToInstall.installPath = steamPath;
		}

		if (!modToInstall.installPath) {
			showNotification(`Install path is not configured for ${modToInstall.name}.`, 'error');
			return;
		}

		setInstallStatuses((prev) => ({
			...prev,
			[modToInstall.downloadUrl]: { status: 'pending', progress: 0 },
		}));
		window.api.installMod(modToInstall);
	};

	const handleConfigure = (app) => {
		setSelectedMod(app);
		if (app.id === 'steam') {
			setSteamModalOpen(true);
		}
		if (app.id === 'wemod') {
			setWeModModalOpen(true);
		}
	};

	return (
		<div className="home-page">
			<SteamSettingsModal
				show={isSteamModalOpen}
				onClose={() => setSteamModalOpen(false)}
				licenseStatus={licenseStatus}
                showNotification={showNotification}
			/>
			{isWeModModalOpen && selectedMod && (
				<WeModInstallModal
					show={isWeModModalOpen}
					onClose={() => setWeModModalOpen(false)}
					mod={selectedMod}
					showNotification={showNotification}
				/>
			)}

			<header className="welcome-header">
				<div className="welcome-text">
					<div className="status-indicator"></div>
					<h1>
						Launcher <strong>Ready</strong>
					</h1>
				</div>
				<button className="whats-new-button" onClick={onShowPatchNotes}>
					<Newspaper size={16} />
					What's New?
				</button>
			</header>

			<div id="app-grid">
				{appsConfig.map((app, index) => {
					const status = installStatuses[app.downloadUrl];
					const isProcessing =
						status?.status === 'pending' ||
						status?.status === 'downloading' ||
						status?.status === 'installing';
					return (
						<AppTile
							key={app.id}
							app={app}
							index={index}
							status={status}
							isProcessing={isProcessing}
							onInstall={handleInstallMod}
							onConfigure={handleConfigure}
						/>
					);
				})}
			</div>
		</div>
	);
};

const SettingsPage = ({ showNotification }) => {
	const [showConfirmModal, setShowConfirmModal] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const [isStealthEnabled, setIsStealthEnabled] = useState(false);
	const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
	const [updateChecked, setUpdateChecked] = useState(false);

	const handleCheckForUpdates = () => {
		setIsCheckingForUpdates(true);
		setUpdateChecked(false); // Reset while checking
		setTimeout(() => {
			showNotification('You are on the latest version.', 'success');
			setIsCheckingForUpdates(false);
			setUpdateChecked(true); // Set to true after check
		}, 1500); // 1.5-second delay
	};

	const handleRemoveAllMods = async () => {
		setIsRemoving(true);
		const result = await window.api.removeAllMods();
		if (result.success) {
			showNotification(result.detail, 'success');
		} else {
			showNotification(result.detail, 'error');
		}
		setIsRemoving(false);
		setShowConfirmModal(false);
	};

	return (
		<div className="settings-page">
			<ConfirmationModal
				show={showConfirmModal}
				onClose={() => setShowConfirmModal(false)}
				onConfirm={handleRemoveAllMods}
				title="Confirm Action"
				isProcessing={isRemoving}
			>
				Are you sure you want to remove all installed mods? This action cannot be undone.
			</ConfirmationModal>

			<header className="page-header">
				<Settings size={28} />
				<h2>Settings</h2>
			</header>
			<div className="settings-section">
				<h3>Updates & Maintenance</h3>
				<div className="settings-item">
					<div className="settings-text">
						<h4>Check for Updates</h4>
						<p>Check for new versions of the launcher.</p>
					</div>
					<button
						className="settings-button"
						onClick={handleCheckForUpdates}
						disabled={isCheckingForUpdates || updateChecked}
					>
						{isCheckingForUpdates ? (
							<Loader size={16} className="spinner" />
						) : updateChecked ? (
							<Check size={16} />
						) : (
							<RefreshCw size={16} />
						)}
						{isCheckingForUpdates ? 'Checking...' : updateChecked ? 'Up to Date' : 'Check Now'}
					</button>
				</div>
				<div className="settings-item">
					<div className="settings-text">
						<h4>Remove All Mods</h4>
						<p>Permanently delete all installed mods from games.</p>
					</div>
					<button className="settings-button-danger" onClick={() => setShowConfirmModal(true)}>
						<Trash2 size={16} />
						Remove Mods
					</button>
				</div>
			</div>

			<div className="settings-section">
				<h3>Advanced</h3>
				<div className="settings-item risky">
					<div className="settings-text">
						<h4>Enable Stealth</h4>
						<p>Attempt to hide mod usage. This is experimental and may be unstable.</p>
					</div>
					<label className="toggle-switch">
						<input
							type="checkbox"
							checked={isStealthEnabled}
							onChange={() => setIsStealthEnabled(!isStealthEnabled)}
						/>
						<span className="slider"></span>
					</label>
				</div>
			</div>
		</div>
	);
};

const UserAvatar = ({ user }) => {
  const getInitials = () => {
    if (user?.isAnonymous || !user?.email) {
      return <User size={24} />;
    }
    return user.email.substring(0, 2).toUpperCase();
  };
  return <div className="user-avatar">{getInitials()}</div>;
};

const ProfilePage = ({ user, onLogout, showNotification, licenseStatus, onLicenseUpdate }) => {
	const [licenseKeyInput, setLicenseKeyInput] = useState('');
	const [isVerifying, setIsVerifying] = useState(false);

	const handleVerifyLicense = async () => {
		if (!licenseKeyInput.trim()) {
			showNotification('Please enter a license key.', 'error');
			return;
		}
		setIsVerifying(true);

		try {
			const idToken = await getIdToken(user);
			const response = await fetch(`${workerUrl}/verifyAndClaimLicense`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`,
				},
				body: JSON.stringify({ licenseKey: licenseKeyInput.trim() }),
			});
			const result = await response.json();

			showNotification(result.message, result.success ? 'success' : 'error');
			if (result.success) {
				onLicenseUpdate();
			}
		} catch (error) {
			console.error('Error verifying license:', error);
			showNotification('An error occurred while verifying the license.', 'error');
		}

		setIsVerifying(false);
		setLicenseKeyInput('');
	};

	const handlePasswordReset = async () => {
		if (user.isAnonymous) {
			showNotification("Guest accounts don't have passwords.", 'error');
			return;
		}
		try {
			await sendPasswordResetEmail(auth, user.email);
			showNotification('A password reset link has been sent to your email.', 'success');
		} catch (error) {
			showNotification(error.message, 'error');
		}
	};

	const renderLicenseStatus = () => {
		let statusClass = '';
		let statusIcon = null;
		let statusText = '';

		switch (licenseStatus.status) {
			case 'loading':
				statusClass = 'loading';
				statusIcon = <Loader size={16} className="spinner" />;
				statusText = 'Checking...';
				break;
			case 'unlicensed':
				statusClass = 'unlicensed';
				statusIcon = <XCircle size={16} />;
				statusText = 'Not Active';
				break;
			case 'licensed':
				statusClass = 'licensed';
				statusIcon = <ShieldCheck size={16} />;
				statusText = `Active (${licenseStatus.tier})`;
				break;
			case 'error':
				statusClass = 'error';
				statusIcon = <AlertTriangle size={16} />;
				statusText = 'Error';
				break;
			default:
				statusClass = 'unlicensed';
				statusIcon = <XCircle size={16} />;
				statusText = 'Unknown';
				break;
		}
		return (
			<div className={`license-status-badge ${statusClass}`}>
				{statusIcon}
				<span>{statusText}</span>
			</div>
		);
	};

	return (
		<div className="profile-page">
			<header className="page-header">
				<User size={28} />
				<h2>My Profile</h2>
			</header>

			<div className="profile-card">
				<UserAvatar user={user} />
				<div className="profile-info">
					<h3>{user?.isAnonymous ? 'Guest User' : user?.email}</h3>
					{!user?.isAnonymous && (
						<div
							className={`verification-status ${
								user?.emailVerified ? 'verified' : 'unverified'
							}`}
						>
							{user?.emailVerified ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
							{user?.emailVerified ? 'Verified' : 'Not Verified'}
						</div>
					)}
				</div>
				{!user?.isAnonymous && (
					<button className="profile-button" onClick={handlePasswordReset}>
						<Mail size={16} />
						Change Password
					</button>
				)}
			</div>

			<div className="profile-section">
				<h3>License</h3>
				<div className="profile-item">
					<div className="profile-text">
						<h4>License Status</h4>
						<p>Your current license tier and activation status.</p>
					</div>
					{renderLicenseStatus()}
				</div>

				{licenseStatus.status === 'unlicensed' && (
					<div className="profile-item activation-item">
						<div className="profile-text">
							<h4>Activate License</h4>
							<input
								type="text"
								value={licenseKeyInput}
								onChange={(e) => setLicenseKeyInput(e.target.value)}
								className="username-input"
								placeholder="Enter your license key"
							/>
						</div>
						<button
							className="profile-button"
							onClick={handleVerifyLicense}
							disabled={isVerifying}
						>
							{isVerifying ? <Loader size={16} className="spinner" /> : <ShieldCheck size={16} />}
							{isVerifying ? 'Verifying...' : 'Verify'}
						</button>
					</div>
				)}

				{licenseStatus.status === 'licensed' && (
					<div className="profile-item features-container">
						<div className="profile-text">
							<h4>Included Features</h4>
							<div className="features-list">
								{licenseStatus.features && licenseStatus.features.length > 0 ? (
									licenseStatus.features.map((feature, index) => (
										<div className="feature-item" key={index}>
											<Star size={16} className="lucide-star" />
											<span>{feature}</span>
										</div>
									))
								) : (
									<div className="feature-item">
										<Star size={16} className="lucide-star" />
										<span>No features listed for this tier.</span>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="logout-section">
				<button className="logout-button" onClick={onLogout}>
					<LogOut size={16} />
					Logout
				</button>
			</div>
		</div>
	);
};

const EmailVerificationBanner = ({ user, showNotification }) => {
  const [isSending, setIsSending] = useState(false);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await sendEmailVerification(user);
      showNotification('Verification email sent!', 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
    setIsSending(false);
  };

  return (
    <div className="verification-banner">
      <AlertTriangle size={20} />
      <p>Your email is not verified. Please check your inbox to access all features.</p>
      <button onClick={handleResend} disabled={isSending}>
        {isSending ? 'Sending...' : 'Resend Email'}
      </button>
    </div>
  );
};


function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isHidingLogin, setIsHidingLogin] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [activePage, setActivePage] = useState('home');
	const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [showingPatchNotes, setShowingPatchNotes] = useState(false);
	const [notification, setNotification] = useState({ message: null, type: '' });
	const [isEmailVerified, setIsEmailVerified] = useState(true);

	const [licenseStatus, setLicenseStatus] = useState({ status: 'loading' });
	const [appsConfig, setAppsConfig] = useState([]);
	const [appVersion, setAppVersion] = useState('');

	const fetchFromWorker = async (endpoint, options = {}) => {
		if (!auth.currentUser) {
			throw new Error('User is not authenticated.');
		}
		const idToken = await getIdToken(auth.currentUser);
		const response = await fetch(`${workerUrl}${endpoint}`, {
			...options,
			headers: {
				...options.headers,
				'Content-Type': 'application/json',
				Authorization: `Bearer ${idToken}`,
			},
		});
		if (!response.ok) {
			const errorBody = await response.text();
			console.error(`Worker request failed for ${endpoint}:`, response.status, errorBody);
			throw new Error(`Server Error: ${response.status} - ${errorBody}`);
		}
		return response.json();
	};

	const checkLicense = async () => {
		if (auth.currentUser) {
			setLicenseStatus({ status: 'loading' });
			try {
				const result = await fetchFromWorker('/getLicenseStatus');
				setLicenseStatus(result);
			} catch (error) {
				console.error('Failed to get license status:', error);
				setLicenseStatus({ status: 'error', message: 'Could not connect to server.' });
			}
		} else {
			setLicenseStatus({ status: 'unlicensed' });
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setCurrentUser(user);
				setIsEmailVerified(user.emailVerified || user.isAnonymous);
				setIsHidingLogin(true);
				setTimeout(() => {
					setIsAuthenticated(true);
				}, 500);
			} else {
				setCurrentUser(null);
				setIsAuthenticated(false);
				setIsHidingLogin(false);
				setIsEmailVerified(true);
			}
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const fetchInitialData = async () => {
			if (currentUser) {
				await checkLicense();
				try {
					const config = await fetchFromWorker('/getAppsConfig');
					setAppsConfig(config);
				} catch (error) {
					console.error('Failed to get apps config:', error);
					showNotification(error.message, 'error');
					setAppsConfig([]);
				}
			}
		};
		fetchInitialData();
	}, [currentUser]);
    
    useEffect(() => {
        window.api.getAppVersion().then(setAppVersion);
    }, []);

	const handleLogout = async () => {
		await signOut(auth);
		setActivePage('home');
	};

	const showNotification = (message, type = 'info') => {
		setNotification({ message, type });
	};

	const toggleSidebar = () => {
		setSidebarCollapsed(!isSidebarCollapsed);
	};

	const renderPage = () => {
		if (showingPatchNotes) {
			return <PatchNotesPage onBack={() => setShowingPatchNotes(false)} />;
		}

		switch (activePage) {
			case 'home':
				return (
					<AppGrid
						onShowPatchNotes={() => setShowingPatchNotes(true)}
						licenseStatus={licenseStatus}
						appsConfig={appsConfig}
						showNotification={showNotification}
					/>
				);
			case 'settings':
				return <SettingsPage showNotification={showNotification} />;
			case 'profile':
				return (
					<ProfilePage
						user={currentUser}
						onLogout={handleLogout}
						showNotification={showNotification}
						licenseStatus={licenseStatus}
						onLicenseUpdate={checkLicense}
					/>
				);
			default:
				return (
					<AppGrid
						onShowPatchNotes={() => setShowingPatchNotes(true)}
						licenseStatus={licenseStatus}
						appsConfig={appsConfig}
						showNotification={showNotification}
					/>
				);
		}
	};

	return (
		<div className={`app-background ${isAuthenticated ? 'theme-launcher' : 'theme-login'}`}>
			<Notification
				message={notification.message}
				type={notification.type}
				onDismiss={() => setNotification({ message: null, type: '' })}
			/>
			<TitleBar onToggle={toggleSidebar} showToggle={isAuthenticated} />

			{!isAuthenticated && (
				<div className={`login-wrapper ${isHidingLogin ? 'hiding' : ''}`}>
					<LoginPage showNotification={showNotification} />
				</div>
			)}

			{isAuthenticated && (
				<div id="launcher-shell" className={isSidebarCollapsed ? 'sidebar-collapsed' : ''}>
					<aside className="sidebar">
						<div className="sidebar-title-container">
							<div className="sidebar-title">
								<svg className="logo-icon" viewBox="0 0 24 24">
									<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
								</svg>
								<h1>Laundromod</h1>
							</div>
						</div>
						<nav className="sidebar-nav">
							<button
								className={activePage === 'home' ? 'active' : ''}
								onClick={() => setActivePage('home')}
							>
								<Home size={20} className="lucide" />
								<span>Home</span>
							</button>
							<button
								className={activePage === 'settings' ? 'active' : ''}
								onClick={() => setActivePage('settings')}
							>
								<Settings size={20} className="lucide" />
								<span>Settings</span>
							</button>
							<button
								className={activePage === 'profile' ? 'active' : ''}
								onClick={() => setActivePage('profile')}
							>
								<User size={20} className="lucide" />
								<span>Profile</span>
							</button>
						</nav>
                        {appVersion && <div className="version-bubble">v{appVersion}</div>}
					</aside>

					<div className="main-content-wrapper">
						{!isEmailVerified && (
							<EmailVerificationBanner user={currentUser} showNotification={showNotification} />
						)}
						<div id="app-container" key={activePage}>
							{renderPage()}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
