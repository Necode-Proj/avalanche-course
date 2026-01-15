const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusText = document.getElementById('status');
const addressText = document.getElementById('address');
const networkText = document.getElementById('network');
const errorText = document.getElementById('error');

const FUJI_CHAIN_ID = '0xa869';

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: FUJI_CHAIN_ID }],
                });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    alert("Silakan tambahkan Avalanche Fuji Testnet ke Wallet Anda.");
                }
            }

            updateUI(account);
        } catch (err) {
            errorText.innerText = "Gagal terhubung: " + err.message;
        }
    } else {
        alert("Wallet gk kedeteksi! Instal Core Wallet atau MetaMask dulu.");
    }
}

async function updateUI(account) {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    
    statusText.innerText = "Connected";
    statusText.style.color = "#4ade80"; // Warna hijau
    
    addressText.innerText = `${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
    
    if (chainId === FUJI_CHAIN_ID) {
        networkText.innerText = "Avalanche Fuji";
        networkText.style.color = "#60a5fa";
    } else {
        networkText.innerText = "Wrong Network";
        networkText.style.color = "#f87171";
    }

    connectBtn.innerText = "Connected";
    connectBtn.disabled = true;
}

function disconnectWallet() {
    statusText.innerText = "Not Connected";
    statusText.style.color = "white";
    addressText.innerText = "-";
    networkText.innerText = "-";
    connectBtn.innerText = "Connect Wallet";
    connectBtn.disabled = false;
    errorText.innerText = "";
    alert("Terputus dari aplikasi. Untuk keamanan, putuskan juga koneksi dari ekstensi dompet Anda.");
}

connectBtn.addEventListener('click', connectWallet);
disconnectBtn.addEventListener('click', disconnectWallet);

if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) updateUI(accounts[0]);
        else disconnectWallet();
    });
    window.ethereum.on('chainChanged', () => window.location.reload());
}